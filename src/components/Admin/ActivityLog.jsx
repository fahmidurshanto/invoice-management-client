import  { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState('');

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterEventType) params.eventType = filterEventType;

        const response = await axios.get('https://invoice-management-server.vercel.app/admin/activity-log', { params, withCredentials: true });
        setLogs(response.data);
      } catch (error) {
        toast.error(error.response.data.message || 'Failed to fetch activity logs.');
        console.error('Error fetching activity logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivityLogs();
  }, [searchTerm, filterEventType]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 animate__animated animate__fadeInUp">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">System Activity Log</h2>
      <div className="mb-6 flex flex-wrap items-center space-x-4 space-y-2">
        <input
          type="text"
          placeholder="Search description..."
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          value={filterEventType}
          onChange={(e) => setFilterEventType(e.target.value)}
        >
          <option value="">All Event Types</option>
          <option value="vendor_registered">Vendor Registered</option>
          <option value="vendor_approved">Vendor Approved</option>
          <option value="customer_added">Customer Added</option>
          <option value="invoice_created">Invoice Created</option>
          <option value="invoice_created_and_paid">Invoice Created & Paid</option>
          <option value="invoice_paid">Invoice Paid</option>
          <option value="payout_requested">Payout Requested</option>
          <option value="payout_succeeded">Payout Succeeded</option>
          <option value="payout_failed">Payout Failed</option>
          <option value="fraud_warning_refund">Fraud Warning (Refunded)</option>
          <option value="fraud_warning_refund_failed">Fraud Warning (Refund Failed)</option>
          <option value="subscription_status_updated">Subscription Updated</option>
          <option value="charge_refunded">Charge Refunded</option>
        </select>
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading activity logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-600">No activity recorded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log._id} className="py-4 hover:bg-gray-50 transition duration-150 ease-in-out px-2 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <p className="text-lg font-medium text-gray-900">{log.description}</p>
                <span className="text-sm text-gray-500 flex-shrink-0 ml-4">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Event Type: <span className="font-medium text-indigo-600">{log.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
              {log.relatedId && <p className="text-sm text-gray-600">Related ID: <span className="font-mono text-gray-700">{log.relatedId}</span></p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;

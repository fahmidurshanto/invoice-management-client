import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const PayoutHistory = () => {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayouts = async () => {
      if (!user || !user.username) {
        toast.error('Please log in as a vendor to view payout history.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get('https://invoice-management-server.vercel.app/vendor/payout-history', { withCredentials: true });
        setPayouts(response.data);
      } catch (error) {
        console.error('Error fetching payout history:', error);
        toast.error(error.response.data.message || 'Failed to fetch payout history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayouts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 animate__animated animate__fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Payout History</h1>

      {isLoading ? (
        <p className="text-gray-600">Loading payout history...</p>
      ) : payouts.length === 0 ? (
        <p className="text-gray-600">No payouts recorded yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {payouts.map((payout) => (
              <li key={payout.id} className="px-6 py-5 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xl font-medium text-gray-900">Payout ID: <span className="font-mono text-gray-700">{payout.id}</span></p>
                  <span className="text-base font-bold text-indigo-600">${payout.amount / 100} {payout.currency.toUpperCase()}</span>
                </div>
                <p className="text-base text-gray-600 mb-1">Status: <span className="capitalize font-semibold">{payout.status}</span></p>
                <p className="text-base text-gray-600">Created: {new Date(payout.created * 1000).toLocaleString()}</p>
                {payout.failure_code && (
                  <p className="text-sm text-red-500 mt-1">Failure Code: {payout.failure_code}</p>
                )}
                {payout.failure_message && (
                  <p className="text-sm text-red-500">Failure Message: {payout.failure_message}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PayoutHistory;

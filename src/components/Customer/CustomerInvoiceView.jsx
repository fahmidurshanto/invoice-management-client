import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerInvoiceView = () => {
  const { customerId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!customerId) {
        toast.error('Customer ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/customer/invoices/${customerId}`, { withCredentials: true });
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error(error.response.data.message || 'Failed to fetch invoices.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, [customerId]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md overflow-hidden border border-gray-200">
      {isLoading ? (
        <p className="text-gray-600">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-600">No invoices found for this customer.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="px-6 py-5 hover:bg-gray-50 transition duration-150 ease-in-out">
              <div className="text-xl font-medium text-gray-900 mb-1">Invoice ID: <span className="font-mono text-gray-700">{invoice.id}</span></div>
              <p className="text-base text-gray-600 mb-1">Amount: <span className="font-bold">${invoice.amount}</span></p>
              <p className="text-base text-gray-600 mb-1">Description: {invoice.description}</p>
              <p className="text-base text-gray-600 mb-1">Status: <span className="capitalize">{invoice.status}</span></p>
              {invoice.invoiceUrl && (
                <p className="text-base text-gray-600 mt-2">
                  <a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline transition duration-300 ease-in-out">View Invoice</a>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerInvoiceView;

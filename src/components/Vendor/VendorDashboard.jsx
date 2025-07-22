import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const { user } = useAuth();

  const fetchCustomers = async () => {
    if (!user || !user.username) return;
    try {
      const response = await axios.get(`https://invoice-management-server.vercel.app/vendor/customers/${user.username}`, { withCredentials: true });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error fetching customers.');
    }
  };

  const fetchInvoices = async () => {
    if (!user || !user.username) return;
    try {
      const response = await axios.get(`https://invoice-management-server.vercel.app/vendor/invoices/${user.username}`, { withCredentials: true });
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Error fetching invoices.');
    }
  };

  useEffect(() => {
    if (user && user.username) {
      fetchCustomers();
      fetchInvoices();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 animate__animated animate__fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Vendor Dashboard</h1>

      {user && (
        <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Subscription</h2>
          <p className="text-lg text-gray-700 mb-2">Status: <span className="font-bold capitalize text-indigo-600">{user.subscriptionStatus}</span></p>
          {user.trialEndsAt && user.subscriptionStatus === 'trialing' && (
            <p className="text-md text-gray-600 mb-2">Trial Ends: {new Date(user.trialEndsAt).toLocaleDateString()}</p>
          )}
          {user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing' && (
            <p className="text-md text-red-600 mb-2">Your subscription is not active. Please subscribe to continue full access.</p>
          )}
          {!user.stripeConnectAccountId && (
            <Link
              to="/connect-stripe"
              className="mt-4 inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Connect with Stripe for Payouts
            </Link>
          )}
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          to="/vendor-profile"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          My Profile
        </Link>
        <Link
          to="/add-customer"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Add New Customer
        </Link>
        <Link
          to="/charge-customer"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Charge Customer
        </Link>
        <Link
          to="/create-invoice"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Create Invoice
        </Link>
        <Link
          to="/subscribe"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Subscribe
        </Link>
        {user && user.stripeConnectAccountId && (
          <Link
            to="/request-payout"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Request Payout
          </Link>
        )}
        <Link
          to="/payout-history"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Payout History
        </Link>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Customers</h2>
      {
        customers.length === 0 ? (
          <p className="text-gray-600">No customers added yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <li key={customer.id} className="px-6 py-5 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xl font-medium text-gray-900">{customer.name} (<span className="text-indigo-600">{customer.email}</span>)</div>
                    <Link
                      to={`/save-card/${customer.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                      Save Card
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Stripe Customer ID: <span className="font-mono text-gray-700">{customer.id}</span></p>
                  {customer.phone && <p className="text-sm text-gray-500 mb-1">Phone: {customer.phone}</p>}
                  {customer.lastInvoice ? (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 font-semibold">Last Paid Invoice:</p>
                      <p className="text-sm text-gray-600">Amount: <span className="font-bold">${customer.lastInvoice.amount} {customer.lastInvoice.currency}</span></p>
                      <p className="text-sm text-gray-600">Status: <span className="capitalize">{customer.lastInvoice.status}</span></p>
                      <p className="text-sm text-gray-600">Date: {customer.lastInvoice.date}</p>
                      {customer.lastInvoice.url && (
                        <a href={customer.lastInvoice.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline text-sm mt-1 block transition duration-300 ease-in-out">
                          View Last Invoice
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600">No recent paid invoices.</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      <h2 className="text-3xl font-semibold text-gray-800 mb-6 mt-10">Your Invoices</h2>
      {
        invoices.length === 0 ? (
          <p className="text-gray-600">No invoices created yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <li key={invoice.id} className="px-6 py-5 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="text-xl font-medium text-gray-900 mb-1">Invoice for Customer ID: <span className="font-mono text-gray-700">{invoice.customerId}</span></div>
                  <p className="text-base text-gray-600">Amount: <span className="font-bold">${invoice.amount}</span></p>
                  <p className="text-base text-gray-600">Description: {invoice.description}</p>
                  <p className="text-base text-gray-600">Status: <span className="capitalize">{invoice.status}</span></p>
                  {invoice.invoiceUrl && (
                    <p className="text-base text-gray-600 mt-2">
                      <a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline transition duration-300 ease-in-out">View Invoice</a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  );
};

export default VendorDashboard;

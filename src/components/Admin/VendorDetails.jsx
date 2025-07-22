import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const VendorDetails = () => {
  const { username } = useParams();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(`https://invoice-management-server.vercel.app/admin/vendor-details/${username}`, { withCredentials: true });
        setVendorDetails(response.data);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
        toast.error(error.response.data.message || 'Failed to fetch vendor details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendorDetails();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading vendor details...</p>
      </div>
    );
  }

  if (!vendorDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
        <p className="text-xl text-red-600">Vendor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 animate__animated animate__fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Vendor Details: {vendorDetails.username}</h1>

      <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
          <p><strong>Username:</strong> {vendorDetails.username}</p>
          <p><strong>Approved:</strong> {vendorDetails.approved ? 'Yes' : 'No'}</p>
          <p><strong>Stripe Customer ID:</strong> {vendorDetails.stripeCustomerId}</p>
          {vendorDetails.stripeConnectAccountId && (
            <p><strong>Stripe Connect Account ID:</strong> {vendorDetails.stripeConnectAccountId}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Subscription Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
          <p><strong>Status:</strong> <span className="font-bold capitalize">{vendorDetails.subscriptionStatus}</span></p>
          {vendorDetails.trialEndsAt && (
            <p><strong>Trial Ends:</strong> {new Date(vendorDetails.trialEndsAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Customers ({vendorDetails.customers.length})</h2>
        {vendorDetails.customers.length === 0 ? (
          <p className="text-gray-600">No customers for this vendor.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {vendorDetails.customers.map((customer) => (
              <li key={customer.id} className="py-4">
                <p className="text-lg font-medium text-gray-900">{customer.name} ({customer.email})</p>
                <p className="text-sm text-gray-500">ID: {customer.id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Invoices ({vendorDetails.invoices.length})</h2>
        {vendorDetails.invoices.length === 0 ? (
          <p className="text-gray-600">No invoices for this vendor.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {vendorDetails.invoices.map((invoice) => (
              <li key={invoice.id} className="py-4">
                <p className="text-lg font-medium text-gray-900">Invoice ID: {invoice.id}</p>
                <p className="text-sm text-gray-500">Customer ID: {invoice.customerId}</p>
                <p className="text-sm text-gray-500">Amount: ${invoice.amount}</p>
                <p className="text-sm text-gray-500">Status: {invoice.status}</p>
                {invoice.invoiceUrl && (
                  <p className="text-sm text-gray-500">
                    <a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">View Invoice</a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;

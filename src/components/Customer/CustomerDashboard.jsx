import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerInvoiceView from './CustomerInvoiceView';

const CustomerDashboard = () => {
  const { customerId } = useParams();

  if (!customerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
        <p className="text-xl text-red-600">Customer ID is missing. Please use a valid link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 animate__animated animate__fadeInUp">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
        Welcome, <span className="text-indigo-600">Customer!</span>
      </h1>
      <p className="text-xl text-gray-700 mb-10 text-center">Here are your invoices:</p>
      <CustomerInvoiceView />
    </div>
  );
};

export default CustomerDashboard;

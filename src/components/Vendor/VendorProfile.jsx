import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VendorProfile = () => {
  const { user, login } = useAuth();

  const handleCancelSubscription = async () => {
    if (!user || !user.username) {
      toast.error('Please log in to manage your subscription.');
      return;
    }
    try {
      const response = await axios.post('https://invoice-management-server.vercel.app/vendor/cancel-subscription', { vendorUsername: user.username }, { withCredentials: true });
      toast.success(response.data.message);
      login(response.data.vendor); // Update AuthContext with new vendor data
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to cancel subscription.');
    }
  };

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
        <p className="text-xl text-red-600">Access Denied. Please log in as a vendor.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 animate__animated animate__fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Approval Status:</strong> {user.approved ? 'Approved' : 'Pending Approval'}</p>
          <p><strong>Stripe Customer ID:</strong> {user.stripeCustomerId}</p>
          {user.stripeConnectAccountId && (
            <p><strong>Stripe Connect Account ID:</strong> {user.stripeConnectAccountId}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Subscription Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
          <p><strong>Status:</strong> <span className="font-bold capitalize text-indigo-600">{user.subscriptionStatus}</span></p>
          {user.trialEndsAt && user.subscriptionStatus === 'trialing' && (
            <p><strong>Trial Ends:</strong> {new Date(user.trialEndsAt).toLocaleDateString()}</p>
          )}
          {user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing' && (
            <p className="text-md text-red-600">Your subscription is not active. Please subscribe to continue full access.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <Link
            to="/subscribe"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Manage Subscription
          </Link>
          {user.subscriptionStatus === 'active' && (
            <button
              onClick={handleCancelSubscription}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Payouts & Stripe Connect</h2>
        {user.stripeConnectAccountId ? (
          <p className="text-lg text-gray-700 mb-2"><strong>Stripe Connect Account ID:</strong> {user.stripeConnectAccountId}</p>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-2">You haven't connected your Stripe account for payouts yet.</p>
            <Link
              to="/connect-stripe"
              className="mt-4 inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Connect with Stripe for Payouts
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;

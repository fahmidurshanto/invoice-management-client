import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ConnectStripe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  const handleConnect = async () => {
    setIsLoading(true);
    if (!user || !user.username) {
      toast.error('Please log in as a vendor to connect Stripe.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/vendor/create-stripe-connect-account', {
        vendorUsername: user.username,
      }, { withCredentials: true });
      if (response.data.url) {
        login(response.data.vendor); // Update AuthContext with new vendor data
        window.location.href = response.data.url; // Redirect to Stripe for onboarding
      } else {
        toast.error('Failed to get Stripe Connect URL.');
      }
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to connect Stripe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Connect Your Stripe Account
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Connect your Stripe account to enable instant payouts and manage your finances.
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-lg font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Connecting...' : 'Connect with Stripe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectStripe;

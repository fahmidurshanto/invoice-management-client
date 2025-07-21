import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionForm from './SubscriptionForm';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Subscribe = () => {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!user || !user.username) {
        setLoadingClientSecret(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/vendor/create-subscription-setup-intent', {},
          { withCredentials: true }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching subscription client secret:', error);
        toast.error(error.response.data.message || 'Failed to get subscription payment details.');
      } finally {
        setLoadingClientSecret(false);
      }
    };

    fetchClientSecret();
  }, [user]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Subscribe to Monthly Plan
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Your 30-day free trial is ending soon. Subscribe now to continue full access.
          </p>
        </div>
        {loadingClientSecret ? (
          <p className="text-center text-gray-600">Loading payment options...</p>
        ) : user && user.username && clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <SubscriptionForm vendorUsername={user.username} clientSecret={clientSecret} />
          </Elements>
        ) : (
          <p className="text-center text-red-600">Please log in to subscribe or an error occurred loading payment options.</p>
        )}
      </div>
    </div>
  );
};

export default Subscribe;

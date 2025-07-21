import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'; // We will create this next
import axios from 'axios';
import { toast } from 'react-toastify';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SaveCardForm = () => {
  const { customerId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!customerId) {
        toast.error('Customer ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/create-setup-intent', { customerId }, { withCredentials: true });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
        toast.error(error.response.data.message || 'Failed to get client secret.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Save Your Card Details
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Please enter your card details securely to enable future payments.
          </p>
        </div>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm customerId={customerId} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default SaveCardForm;

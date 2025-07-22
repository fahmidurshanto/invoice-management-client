import  { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

 const SubscriptionForm = ({ vendorUsername, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Stripe.js hasn't yet loaded or clientSecret is missing.
      return;
    }

    // Ensure the PaymentElement is mounted
    const paymentElement = elements.getElement(PaymentElement);
    if (!paymentElement) {
      toast.error('Payment form is not ready. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      clientSecret, // Pass the clientSecret here
      confirmParams: {
        return_url: window.location.origin + '/subscription-success', // We will create this route later
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    // If no immediate error, proceed to create subscription on your backend
    try {
      const response = await axios.post('https://invoice-management-server.vercel.app/vendor/create-subscription', {
        vendorUsername,
        paymentMethodId: setupIntent.payment_method,
      }, { withCredentials: true });
      toast.success(response.data.message);
      login(response.data.vendor); // Update AuthContext with new vendor data
      // Redirect to success page or update UI
      // navigate('/subscription-success');
    } catch (apiError) {
      toast.error(apiError.response.data.message || 'Subscription failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="subscription-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit"
        className="mt-8 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Subscribe Now"}
        </span>
      </button>
      {/* Show any error or success messages */}
    </form>
  );
};


export default SubscriptionForm;
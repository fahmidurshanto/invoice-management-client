import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const CheckoutForm = ({ customerId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.origin + `/customer/dashboard/${customerId}`,
      },
    });

    // This point will only be reached if there is an immediate error when confirming the setup.
    // Otherwise, your customer will be redirected to your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit"
        className="mt-8 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Save Card"}
        </span>
      </button>
      {/* Show any error or success messages */}
      
    </form>
  );
};

export default CheckoutForm;

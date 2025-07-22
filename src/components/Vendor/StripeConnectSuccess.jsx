import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StripeConnectSuccess = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const fetchUpdatedVendor = async () => {
      if (user && user.username) {
        try {
          // Fetch the updated vendor data using the new endpoint
          const response = await axios.get('https://invoice-management-server.vercel.app/vendor/get-current-user', { withCredentials: true });
          if (response.status === 200) {
            login(response.data.vendor); // Update AuthContext
            toast.success('Stripe account connected successfully!');
            navigate('/dashboard'); // Redirect to dashboard
          }
        } catch (error) {
          console.error('Error fetching updated vendor data:', error);
          toast.error(error.response.data.message || 'Failed to fetch updated vendor data.');
          navigate('/login');
        }
      } else {
        // If user is not in context, redirect to login
        toast.error('User not logged in. Redirecting to login.');
        navigate('/login');
      }
    };

    fetchUpdatedVendor();
  }, [user, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
          Connecting Stripe Account...
        </h2>
        <p className="mt-2 text-center text-base text-gray-600">
          Please wait while we finalize your Stripe connection.
        </p>
      </div>
    </div>
  );
};

export default StripeConnectSuccess;

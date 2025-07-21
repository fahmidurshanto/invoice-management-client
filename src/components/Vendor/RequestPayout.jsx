import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RequestPayout = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!amount) {
      toast.error('Please enter an amount.');
      setIsLoading(false);
      return;
    }
    if (!user || !user.username) {
      toast.error('Please log in as a vendor to request a payout.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/vendor/request-payout', {
        vendorUsername: user.username,
        amount: parseFloat(amount),
      }, { withCredentials: true });
      toast.success(response.data.message);
      setAmount('');
    } catch (error) {
      toast.error(error.response.data.message || 'Payout request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Request Instant Payout
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                id="payout-amount"
                name="payout-amount"
                type="number"
                step="0.01"
                required
                className="relative block w-full appearance-none rounded-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Amount to Payout (e.g., 100.00)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Requesting Payout...' : 'Request Payout'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RequestPayout;

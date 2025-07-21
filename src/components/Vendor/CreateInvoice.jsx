import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const CreateInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user || !user.username) {
        toast.error('Please log in as a vendor to create invoices.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/vendor/customers/${user.username}`, { withCredentials: true });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error(error.response.data.message || 'Failed to fetch customers.');
      }
    };
    fetchCustomers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedCustomer || !amount || !description) {
      toast.error('Please select a customer, enter an amount, and a description.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/create-invoice', {
        customerId: selectedCustomer,
        amount: parseFloat(amount),
        description,
      }, { withCredentials: true });
      toast.success(response.data.message + ` Invoice ID: ${response.data.invoiceId}. View: ${response.data.invoiceUrl}`);
      setAmount('');
      setDescription('');
    } catch (error) {
      toast.error(error.response.data.message || 'Invoice creation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Create Invoice
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="customer-select" className="sr-only">Select Customer</label>
              <select
                id="customer-select"
                name="customer-select"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Select a Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Amount (e.g., 99.99)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                rows="3"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Invoice Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customerLink, setCustomerLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!user || !user.username) {
      toast.error('Please log in as a vendor to add customers.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post('https://invoice-management-server.vercel.app/create-customer', { name, email, phone });
      const customerId = response.data.customerId;

      const vendorUsername = user.username; 

      await axios.post('https://invoice-management-server.vercel.app/vendor/add-customer', { vendorUsername, customerId }, { withCredentials: true });

      // Generate invite link using the new backend endpoint
      const inviteLinkResponse = await axios.post('https://invoice-management-server.vercel.app/customer/generate-invite-link', { customerId }, { withCredentials: true });
      const generatedInviteLink = inviteLinkResponse.data.inviteLink;

      toast.success(response.data.message + ` Customer ID: ${customerId}. Associated with vendor.`);
      setCustomerLink(generatedInviteLink);
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to add customer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Add New Customer
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                id="customer-name"
                name="customer-name"
                type="text"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                id="customer-email"
                name="customer-email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Customer Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="customer-phone"
                name="customer-phone"
                type="text"
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Customer Phone (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Adding Customer...' : 'Add Customer'}
            </button>
          </div>
        </form>
      
        {customerLink && (
          <div className="mt-6 p-5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-inner">
            <p className="font-bold text-lg mb-2">Customer Added! Share this link for card details:</p>
            <a href={customerLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline break-all font-medium transition duration-300 ease-in-out">
              {customerLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomer;

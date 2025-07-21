import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityLog from './ActivityLog';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  // const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproved, setFilterApproved] = useState(''); // 'true', 'false', or ''
  const [filterSubscription, setFilterSubscription] = useState(''); // 'trialing', 'active', etc.

  const fetchPendingVendors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/vendors/pending', { withCredentials: true });
      setPendingVendors(response.data);
    } catch (error) {
      console.error('Error fetching pending vendors:', error);
      toast.error('Error fetching pending vendors.');
    }
  };

  const fetchAllVendors = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterApproved) params.approved = filterApproved;
      if (filterSubscription) params.subscriptionStatus = filterSubscription;

      const response = await axios.get('http://localhost:5000/admin/vendors/all', { params, withCredentials: true });
      setAllVendors(response.data);
    } catch (error) {
      console.error('Error fetching all vendors:', error);
      toast.error('Error fetching all vendors.');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/analytics', { withCredentials: true });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error fetching analytics.');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin/login', { username: adminUsername, password: adminPassword }, { withCredentials: true });
      toast.success(response.data.message);
      if (response.status === 200) {
        setLoggedIn(true);
        fetchPendingVendors(); // Fetch pending vendors after successful login
        fetchAllVendors(); // Fetch all vendors after successful login
        fetchAnalytics(); // Fetch analytics after successful login
      }
    } catch (error) {
      toast.error(error.response.data.message || 'Admin login failed.');
    }
  };

  const handleApproveVendor = async (username) => {
    try {
      const response = await axios.post('http://localhost:5000/admin/vendors/approve', { username }, { withCredentials: true });
      toast.success(response.data.message);
      fetchPendingVendors(); // Refresh the list after approval
      fetchAllVendors(); // Refresh all vendors list as well
      fetchAnalytics(); // Refresh analytics as well
    } catch (error) {
      toast.error(error.response.data.message || 'Vendor approval failed.');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchPendingVendors();
      fetchAllVendors();
      fetchAnalytics();
    }
  }, [loggedIn, searchTerm, filterApproved, filterSubscription]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="admin-username"
                  name="admin-username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="admin-password"
                  name="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 animate__animated animate__fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Vendors</h3>
            <p className="text-4xl font-bold text-indigo-600">{analytics.totalVendors}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Approved Vendors</h3>
            <p className="text-4xl font-bold text-green-600">{analytics.approvedVendors}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Trialing Vendors</h3>
            <p className="text-4xl font-bold text-yellow-600">{analytics.trialingVendors}</p>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Pending Vendor Approvals</h2>
      {
        pendingVendors.length === 0 ? (
          <p className="text-gray-600">No pending vendors.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {pendingVendors.map((vendor) => (
                <li key={vendor.username} className="px-6 py-4 flex items-center justify-between">
                  <div className="text-xl font-medium text-gray-900">{vendor.username}</div>
                  <button
                    onClick={() => handleApproveVendor(vendor.username)}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      }

      <h2 className="text-3xl font-semibold text-gray-800 mb-6 mt-10">All Vendors</h2>
      <div className="mb-6 flex flex-wrap items-center space-x-4 space-y-2">
        <input
          type="text"
          placeholder="Search by username..."
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          value={filterApproved}
          onChange={(e) => setFilterApproved(e.target.value)}
        >
          <option value="">All Approval Statuses</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          value={filterSubscription}
          onChange={(e) => setFilterSubscription(e.target.value)}
        >
          <option value="">All Subscription Statuses</option>
          <option value="trialing">Trialing</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      {
        allVendors.length === 0 ? (
          <p className="text-gray-600">No vendors registered.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {allVendors.map((vendor) => (
                <li key={vendor.username} className="px-6 py-4">
                  <div className="text-xl font-medium text-gray-900 mb-1">
                    <Link to={`/admin/vendor-details/${vendor.username}`} className="text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">
                      {vendor.username}
                    </Link>
                  </div>
                  <p className="text-base text-gray-600">Approved: {vendor.approved ? 'Yes' : 'No'}</p>
                  <p className="text-base text-gray-600">Subscription Status: <span className="capitalize">{vendor.subscriptionStatus}</span></p>
                  {vendor.trialEndsAt && (
                    <p className="text-base text-gray-600">Trial Ends: {new Date(vendor.trialEndsAt).toLocaleDateString()}</p>
                  )}
                  {vendor.stripeCustomerId && (
                    <p className="text-base text-gray-600">Stripe Customer ID: {vendor.stripeCustomerId}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      <div className="mt-10">
        <ActivityLog />
      </div>
    </div>
  );
};

export default AdminDashboard;

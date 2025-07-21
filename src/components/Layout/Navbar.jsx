import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-indigo-700 py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold tracking-tight">
          InvoiceApp
        </Link>
        <div className="flex items-center space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                Register
              </Link>
            </>
          ) : (
            <>
              {user.username === 'admin' ? (
                <Link to="/admin" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/dashboard" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                  Vendor Dashboard
                </Link>
              )}
              <span className="text-white text-lg font-medium">Welcome, {user.username}!</span>
              <button onClick={handleLogout} className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium bg-transparent border-none cursor-pointer p-0">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

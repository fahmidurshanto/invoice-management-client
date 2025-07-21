import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-6 animate__animated animate__fadeInDown text-center leading-tight">
        Welcome to <span className="text-indigo-600">InvoiceApp</span>
      </h1>
      <p className="text-xl text-gray-700 mb-10 animate__animated animate__fadeInUp animate__delay-1s text-center max-w-2xl">
        Your comprehensive solution for managing invoices, payments, and customers with ease and efficiency.
      </p>
      {!user && (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate__animated animate__fadeInUp animate__delay-2s">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 border border-indigo-600 text-base font-bold rounded-full shadow-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

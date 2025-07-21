import Home from '../components/Home/Home';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AddCustomer from '../components/Customer/AddCustomer';
import SaveCardForm from '../components/Customer/SaveCardForm';
import VendorDashboard from '../components/Vendor/VendorDashboard';
import ChargeCustomer from '../components/Vendor/ChargeCustomer';
import CreateInvoice from '../components/Vendor/CreateInvoice';
import Subscribe from '../components/Vendor/Subscribe';
import RequestPayout from '../components/Vendor/RequestPayout';
import ConnectStripe from '../components/Vendor/ConnectStripe';
import CustomerInvoiceView from '../components/Customer/CustomerInvoiceView';
import CustomerDashboard from '../components/Customer/CustomerDashboard';
import VendorProfile from '../components/Vendor/VendorProfile';
import PayoutHistory from '../components/Vendor/PayoutHistory';
import VendorDetails from '../components/Admin/VendorDetails';
import StripeConnectSuccess from '../components/Vendor/StripeConnectSuccess';



const SubscriptionSuccess = () => <div>Subscription Successful!</div>;

const CardSavedSuccess = () => <div>Card Saved Successfully!</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/vendor-details/:username" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <VendorDetails />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/add-customer" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <AddCustomer />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/save-card/:customerId" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <SaveCardForm />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/charge-customer" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <ChargeCustomer />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/create-invoice" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <CreateInvoice />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/subscribe" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Subscribe />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/request-payout" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <RequestPayout />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/vendor-profile" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProfile />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/payout-history" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <PayoutHistory />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/connect-stripe" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <ConnectStripe />
          </ProtectedRoute>
        }
      />

      <Route path="/card-saved-success" element={<CardSavedSuccess />} />
      <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      <Route path="/stripe-connect-success" element={<StripeConnectSuccess />} />
      <Route path="/customer/dashboard/:customerId" element={<CustomerDashboard />} />
    </Routes>
  );
};

export default AppRoutes;

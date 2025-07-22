# Invoice Management System

This is a comprehensive invoice management system prototype designed to facilitate vendor-customer interactions, invoicing, payments, and subscriptions, with full Stripe integration.

## Features

### Vendor Management
- **Vendor Registration & Approval:** New vendors can register and await approval from an administrator.
- **Authentication:** Secure JWT-based authentication with `httpOnly` cookies for robust session persistence.
- **Password Hashing:** Passwords are securely hashed using `bcryptjs`.
- **Vendor Dashboard:** A central hub for vendors to manage their customers, invoices, and payments.
  - **Enhanced Customer Details:** Displays more comprehensive customer information, including last invoice details.
- **Vendor Profile:** Dedicated page for vendors to view their account, subscription status, and Stripe Connect details.
  - **Subscription Cancellation:** Vendors can cancel their active subscriptions directly from their profile.

### Customer Management
- **Add/Invite Customers:** Vendors can add new customers, which creates a corresponding Stripe Customer object.
- **Secure Card Saving:** Customers receive a unique invite link to a secure Stripe-hosted form to save their payment card details.
- **Customer Dashboard:** A dedicated portal for customers to view all their invoices.

### Payments & Invoicing
- **Charge Custom Amounts:** Vendors can charge customers with saved cards using Stripe Payment Intents.
- **Invoice Creation:** Vendors can create invoices. If a customer has a saved card, the invoice is automatically charged; otherwise, it's set for manual payment.
- **Invoice Status Updates:** Real-time updates for invoice payment status via Stripe webhooks.

### Subscriptions
- **30-Day Free Trial:** New vendors start with a free trial period.
- **Monthly Subscription:** Vendors can subscribe to a monthly plan via Stripe Subscriptions.
- **Subscription Status Sync:** Backend webhooks keep vendor subscription statuses in sync with Stripe.

### Payouts
- **Stripe Express Integration:** Vendors can connect their Stripe accounts for instant payouts.
- **Payout Requests:** Vendors can request payouts to their connected Stripe Express accounts.
- **Payout History:** Vendors can view a record of their past payouts.
- **Payout Status Tracking:** Backend webhooks track the success or failure of payouts.

### Admin Panel
- **Admin Login:** Secure access for administrators.
- **Vendor Approval:** Admins can approve or reject new vendor registrations.
- **Vendor Analytics:** Overview of total, approved, and trialing vendors.
- **System Activity Log:** Comprehensive log of key system events (registrations, approvals, customer additions, invoice payments, fraud warnings, payouts).
  - **Search and Filtering:** Admins can search and filter activity logs by description and event type.
- **Vendor Details View:** Admins can view detailed information for individual vendors, including their customers and invoices.
  - **Search and Filtering:** Admins can search and filter vendors by username, approval status, and subscription status.

### UI/UX Enhancements
- **Responsive Design:** Built with Tailwind CSS for a modern and responsive user interface.
- **Animations:** Subtle UI animations using Animate.css for an enhanced user experience.
- **User Feedback:** Integrated `react-toastify` for clear success and error notifications across the application.
- **Loading Indicators:** Visual feedback during asynchronous operations on forms and buttons.
- **Conditional UI:** Buttons and navigation elements are conditionally rendered based on user authentication status and roles.

## Technologies Used

### Frontend
- **React.js:** JavaScript library for building user interfaces.
- **Vite:** Fast frontend build tool.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Animate.css:** Library for easy-to-use CSS animations.
- **React Router DOM:** For declarative routing in React applications.
- **Axios:** Promise-based HTTP client for the browser and Node.js.
- **React Toastify:** For customizable toast notifications.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** NoSQL database for data persistence.
- **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
- **Stripe API:** For all payment, invoicing, subscription, and payout functionalities.
- **JSON Web Token (JWT):** For secure authentication.
- **Bcrypt.js:** For password hashing.
- **Cookie-Parser:** Middleware to parse HTTP cookies.
- **Dotenv:** For loading environment variables from a `.env` file.
- **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

## Setup Instructions

### Prerequisites
- Node.js (LTS version recommended)
- npm (comes with Node.js)
- MongoDB (local instance or cloud-hosted like MongoDB Atlas)
- Stripe Account (for API keys and webhooks)
- Stripe CLI (for local webhook testing)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd invoice-management-system
```

### 2. Backend Setup
Navigate to the `invoice-management-server` directory:
```bash
cd invoice-management-server
```

**Install Dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `invoice-management-server` directory with the following content:
```dotenv
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=supersecretjwtkey # Use a strong, random key in production
```
- Replace `your_stripe_secret_key_here` with your actual Stripe Secret Key (starts with `sk_test_` or `sk_live_`).
- Replace `your_stripe_webhook_secret_here` with your Stripe Webhook Signing Secret (obtained from Stripe Dashboard or `stripe listen`).
- Replace `your_mongodb_connection_string_here` with your MongoDB connection URI.

**Start the Backend Server:**
```bash
npm start
```
The server will run on `https://invoice-management-server.vercel.app`.

### 3. Frontend Setup
Open a new terminal and navigate to the `invoice-management-client` directory:
```bash
cd ../invoice-management-client
```

**Install Dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
Create a `.env.local` file in the `invoice-management-client` directory with the following content:
```dotenv
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```
- Replace `your_stripe_publishable_key_here` with your actual Stripe Publishable Key (starts with `pk_test_` or `pk_live_`).

**Start the Frontend Development Server:**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` (or another available port).

### 4. Stripe CLI Setup (for Local Webhook Testing)
If you haven't already, install the [Stripe CLI](https://stripe.com/docs/stripe-cli).

**Log in to Stripe CLI:**
```bash
stripe login
```

**Listen for Webhook Events:**
In a separate terminal, run the following command to forward Stripe webhook events to your local backend:
```bash
stripe listen --forward-to localhost:5000/stripe-webhook
```
This command will output a `whsec_...` secret. **Copy this secret and update your `STRIPE_WEBHOOK_SECRET` in the backend's `.env` file.** Keep this terminal running while testing webhook-dependent features.

## Usage & Testing

1.  **Access the Application:** Open your browser and go to `http://localhost:5173`.
2.  **Admin Login:** Use `username: admin`, `password: adminpass` to access the Admin Dashboard (`/admin`).
3.  **Vendor Registration:** Register a new vendor via the `/register` page.
4.  **Vendor Approval:** Log in as admin, go to `/admin`, and approve the new vendor.
5.  **Vendor Login:** Log in as the approved vendor via the `/login` page. You will be redirected to the Vendor Dashboard (`/dashboard`).
6.  **Add Customer:** From the Vendor Dashboard, add a new customer. You will get an invite link to share with the customer.
7.  **Customer Card Save:** Open the invite link (e.g., `http://localhost:5173/customer/dashboard/<customerId>`) in an incognito window or different browser to simulate a customer saving their card details.
8.  **Create Invoice/Charge Customer:** From the Vendor Dashboard, create an invoice or charge a customer.
9.  **Subscription:** From the Vendor Dashboard, subscribe to the monthly plan.
10. **Stripe Connect:** Connect your Stripe account for payouts from the Vendor Profile page.
11. **Request Payout:** Request a payout from the Vendor Dashboard.
12. **Monitor Activity:** Check the Admin Dashboard for analytics and activity logs.

## Future Enhancements
- Implement more robust error handling and user feedback mechanisms.
- Enhance Stripe Connect onboarding flow for better user experience.
- Implement comprehensive unit and integration tests.
- Further UI/UX refinements and responsiveness improvements.
- Allow vendors to manage (cancel/change) their subscriptions (already implemented, but can be expanded).
- Add more detailed customer information and management features for vendors (already implemented, but can be expanded).
- Implement search and filtering functionalities for various lists (vendors, customers, invoices, activity logs) (already implemented, but can be expanded).

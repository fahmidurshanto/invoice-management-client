import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes/Routes';
import Navbar from './components/Layout/Navbar';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loading } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading application...</p>
        </div>
      ) : (
        <AppRoutes />
      )}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </BrowserRouter>
  );
}

export default App;
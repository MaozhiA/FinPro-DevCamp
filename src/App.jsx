import Products from './components/Products/product.jsx';
import Login from './components/Login/login.jsx';
import Register from './components/Register/register.jsx';
import ProductDetails from './components/product-details/product-details.jsx';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/side-navbar/navbar.jsx';
// import Home from './components/home/home.jsx';
import OriginalHome from './components/home/org-home.jsx';
import RecommendedPage from './components/home/recommended.jsx';
import NewArrivalsPage from './components/home/new-arrivals.jsx';
import LoginStart from './components/login-startup/login-startup.jsx';
import VerifyEmail from './components/email/verify-email.jsx';
import ClientProfile from './components/profile/client-profile.jsx';
import ProfileVerification from './components/verification/profile-verification.jsx'
import FileDialgoue from './components/filepicker/dialogue.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import Footer from './components/footer/footer.jsx';

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || 
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/login-startup";

    
  const hideFooter =
    location.pathname === "/" || 
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/login-startup";


  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar /> }
 

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LoginStart />} />
          <Route path="/login-startup" element={<LoginStart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/profile-verification" element={<ProfileVerification />} />
          <Route path="/dialogue" element={<FileDialgoue />} />
           
          

          <Route path="/products" element={<Products />} />
          <Route path="/recommended" element={<RecommendedPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/home" element={<OriginalHome />} />
        </Routes>
      </main>
      
     {!hideFooter && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default App;
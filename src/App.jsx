import Products from './components/Products/product.jsx';
import Login from './components/Login/login.jsx';
import Register from './components/Register/register.jsx';
import ProductDetails from './components/product-details/product-details.jsx';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/side-navbar/navbar.jsx';
import Home from './components/home/home.jsx';
import './App.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/login" element={<Login />} />
               
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
           <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;

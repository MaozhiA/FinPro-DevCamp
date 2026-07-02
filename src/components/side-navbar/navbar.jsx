import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(cart.length);
    };

    updateCount();
    window.addEventListener("cartUpdated", updateCount);

    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("loginAccessKey");
    // localStorage.removeItem("uploaded_document");
    // localStorage.removeItem("uploaded_selfie");
    await signOut(auth);
    navigate("/login-startup");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-[#001580]">InsureTechGuard</div>

      <div className="flex gap-6 text-sm">
        <Link to="/home" className="hover:text-black text-gray-600">
          Home
        </Link>

        <Link to="/products" className="hover:text-black text-gray-600">
          Products
        </Link>

        {user && !user.isAnonymous && (
          <Link to="/client-profile" className="hover:text-black text-gray-600">
            Profile
          </Link>
        )}
        {user && !user.isAnonymous && (
          <Link
            to="/customer-account"
            className="hover:text-black text-gray-600"
          >
            {" "}
            Accounts
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-black"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-sm text-gray-600 hover:text-black"
            >
              Register
            </Link>
          </>
        )}

        {user && !user.isAnonymous && (
          <>
            <span className="text-xs px-3 py-1 rounded-full bg-gray text-green-700 border border-green-300">
              Logged In
            </span>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </>
        )}
        <Link to="/cart" className="relative">
          <ShoppingCart size={20} className="text-slate-600" />
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white 
            text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
              {cartCount}
            </span>
          )}
        </Link>

        {user && user.isAnonymous && (
          <>
            <span className="text-xs px-3 py-1 rounded-full bg-gray text-yellow-700 border border-yellow-300">
              Guest
            </span>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Exit Guest
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

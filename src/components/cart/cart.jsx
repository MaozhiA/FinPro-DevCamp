import { useState, useEffect } from "react";
import { getCartItems, removeFromCart, clearCart } from "../../utils/cart-func";
import CartCard from "./cart-card";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, []);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    setCartItems(getCartItems());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("loginAccessKey"); // but I am not doing anything with it

    const profileResponse = await axios.get(`/client/v1/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const customerId = profileResponse.data.id;
    try {
      const cartResponse = await axios.post(
        `/v1/product/take-up`,
        {
          customerId: customerId,
          productIds: cartItems.map((item) => item.id),
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("loginAccessKey")}`,
          },
        },
      );

      if (cartResponse.status === 200) {
        toast.success("Purchase successful!");
        navigate("/subscriptions");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }

    clearCart();
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartCard
              key={item.id}
              product={item}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          ))}

          <button
            onClick={handleCheckout}
            className="w-full bg-[#001580] text-white py-3 rounded-xl font-semibold mt-6"
          >
            Confirm Purchase
          </button>
        </div>
      )}
    </div>
  );
};
export default Cart;

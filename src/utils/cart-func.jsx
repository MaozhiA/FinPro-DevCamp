export const getCartItems = () => {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
};

export const addToCart = (product) => {
  const cartItems = getCartItems();

  const cartExists = cartItems.find((item) => item.id === product.id);

  if (cartExists) return false;
  cartItems.push(product);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  window.dispatchEvent(new Event("cartUpdated")); 
  return true;
};

export const removeFromCart = (productId) => {
  const cartItems = getCartItems();
  const updatedCartItems = cartItems.filter((item) => item.id !== productId);
  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  return true;
};

export const clearCart = () => {
  localStorage.removeItem("cartItems");
};

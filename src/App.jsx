import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./features/auth/authSlice";
import { listenToCart } from "./features/cart/cartSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Sell from "./pages/Sell";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import { listenToWishlist } from "./features/wishlist/wishlistSlice";

function App() {
  const dispatch = useDispatch();

useEffect(() => {
  let unsubscribeCart;
  let unsubscribeWishlist;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
  if (user) {
    dispatch(loginSuccess(user));

    unsubscribeCart = dispatch(listenToCart(user));
    unsubscribeWishlist = dispatch(listenToWishlist(user)); // ✅ PASS USER
  } else {
    unsubscribeCart && unsubscribeCart();
    unsubscribeWishlist && unsubscribeWishlist();
  }
});

  return () => {
    unsubscribeAuth();
    unsubscribeCart && unsubscribeCart();
    unsubscribeWishlist && unsubscribeWishlist();
  };
}, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/> }/>

        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }/>
        <Route path="/sell" element={
         <ProtectedRoute>
          <Sell />
         </ProtectedRoute>
          } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
          } />
        <Route path="/checkout" element={
         <ProtectedRoute>
           <Checkout />
         </ProtectedRoute>
        
          } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
          }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
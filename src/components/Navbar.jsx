import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const Navigate=useNavigate()
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);
  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    alert("Logged out ✅");
    Navigate('/login')
    
  };

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <h2 className="logo">OLX</h2>

      {/* Links */}
      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/cart">Cart</Link>

          {user ? (
          <>
            {/* ✅ Show Profile when logged in */}
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <>
            {/* ❌ Show Login if not logged in */}
            <Link to="/login">Login</Link>
          </>
        )}
        <div onClick={() => Navigate("/wishlist")} style={{ cursor: "pointer" }}>
          ❤️ Wishlist ({wishlist.length})
        </div>
        
      </div>

      {/* Right Section */}
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="username">
              Hi, {user.name || user.email}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="signup-btn">Signup</Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
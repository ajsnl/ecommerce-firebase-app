import React, { useEffect } from "react"; // ✅ FIXED
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom"; // ✅ FIXED
import { listenToUserProducts } from "../features/products/productSlice";
import "./Profile.css";
function Profile() {
  const user = useSelector((state) => state.auth.user);
  const userProducts = useSelector((state) => state.products.userProducts);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.uid) return;

    const unsubscribe = dispatch(listenToUserProducts(user.uid));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, user]);

  if (!user) return <p>No user logged in</p>;

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    alert("Logged out");
    navigate("/login");
  };

  return (
  <div className="profile-container">

    {/* PROFILE CARD */}
    <div className="profile-card">
      <h2>User Profile</h2>

      <div className="profile-info">
        <p><b>Name:</b> {user.name || user.email.split("@")[0]}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>

    {/* PRODUCTS */}
    <div className="products-section">
      <h3>My Products</h3>

      {userProducts.length === 0 ? (
        <p>No products added</p>
      ) : (
        <div className="product-grid">
          {userProducts.map((item) => (
            <div key={item.id} className="product-card">
              <img src={item.imageUrl} alt={item.title} />

              <h4>{item.title}</h4>
              <p className="price">₹ {item.price}</p>

              {item.sold && <p className="sold">Sold</p>}
            </div>
          ))}
        </div>
      )}
    </div>

  </div>
);
}

export default Profile;
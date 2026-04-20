import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  listenToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState(null); // track removing item

  
  useEffect(() => {
    if (!user) return;

    const unsubscribe = dispatch(listenToWishlist(user));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, user]);

  
  const handleRemove = async (e, id) => {
    e.stopPropagation();

    try {
      setLoadingId(id); // disable button

      await dispatch(removeFromWishlist(id));

      console.log("Removing ID:", id);
    } catch (err) {
      console.error("Remove failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="wishlist-page">
      <h2>❤️ Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="wishlist-card"
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <img src={item.imageUrl} alt={item.title} />

              <h3>₹{item.price}</h3>
              <p>{item.title}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removeFromWishlist(item.productId)); 
            }}
          >
            Remove
          </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
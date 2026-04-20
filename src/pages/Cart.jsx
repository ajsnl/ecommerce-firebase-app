import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCartFirestore } from "../features/cart/cartSlice";
import "./Cart.css";

function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty 😔</h3>
          <button onClick={() => navigate("/")}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          
          {/* 🛍 LEFT - ITEMS */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-card">
                
                <img src={item.imageUrl} alt={item.title} />

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p className="price">₹{item.price}</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    dispatch(removeFromCartFirestore(item.id))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* 💰 RIGHT - SUMMARY */}
          <div className="cart-summary">
            <h3>Price Details</h3>

            <div className="summary-row">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="summary-row">
              <span>Total Price</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;
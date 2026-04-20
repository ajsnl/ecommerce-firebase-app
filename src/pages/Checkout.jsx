import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { markAsSoldFirestore } from "../features/products/productSlice";
import { clearCartFirestore } from "../features/cart/cartSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );


  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        // 🔥 mark EVERY purchased product as sold
        const productRef = doc(db, "products", item.id);

        await updateDoc(productRef, {
          sold: true,
        });
      }

      // ✅ clear cart
      await dispatch(clearCartFirestore());

      alert("Purchase successful ✅");
      navigate("/");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <div>
                <p>{item.title}</p>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>

          <button
            onClick={handleCheckout}
            style={{
              marginTop: "10px",
              padding: "10px",
              width: "100%",
              background: "#002f34",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Confirm Purchase
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
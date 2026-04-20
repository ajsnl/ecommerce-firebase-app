import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCartFirestore } from "../features/cart/cartSlice";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const product = products.find((p) => p.id === id);

  if (!product) return <p className="not-found">Product not found</p>;

  const inCart = cartItems.some((item) => item.id === id);

  return (
    <div className="product-page">
      
      
      <div className="product-image-section">
        <img src={product.imageUrl} alt={product.title} />
      </div>

      
      <div className="product-details-section">
        <h1 className="price">₹{product.price}</h1>

        <h2 className="title">{product.title}</h2>

        <p className="category">{product.category}</p>

        <p className="description">{product.description}</p>

        
        <p className="location">📍 India</p>

        
        <div className="actions">
          {!inCart ? (
            <button
              className="add-btn"
              onClick={() => dispatch(addToCartFirestore(product))}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="go-cart-btn"
              onClick={() => navigate("/cart")}
            >
              Go to Cart 🛒
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./CategoryProducts.css";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

function CategoryProducts() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
const wishlistItems = useSelector((state) => state.wishlist.items);

  const products = useSelector((state) => state.products.products);

  const searchQuery = new URLSearchParams(location.search).get("search");

  let filtered = products.filter((p) => !p.sold);

  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (searchQuery) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="category-container">
      <h2 className="category-title">
        {category === "all" ? "All Products" : category}
      </h2>

      {filtered.length === 0 && (
        <p className="no-products">No products found</p>
      )}

      <div className="product-grid">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="image-container">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />

              <span
              className="wishlist"
              onClick={(e) => {
                e.stopPropagation(); // 🔥 prevent card click

                const isWishlisted = wishlistItems.some(
                  (item) => item.productId === product.id
                );

                if (isWishlisted) {
                  dispatch(removeFromWishlist(product.id)); // ✅ FIX
                } else {
                  dispatch(addToWishlist(product));
                }
              }}
              style={{
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {wishlistItems.some((item) => item.productId === product.id)
                ? "❤️"
                : "🤍"}
            </span>
            </div>

            <div className="product-details">
              <h3 className="price">₹{product.price}</h3>

              <p className="title">{product.title}</p>

              <p className="category">{product.category}</p>

              <p className="location">📍 India</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;
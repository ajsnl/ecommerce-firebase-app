import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToProducts } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";
import categories from "../data/categories";
import { addToWishlist, listenToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";



function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products.products);
  const [search, setSearch] = useState("");

useEffect(() => {
  const unsubscribe1 = dispatch(listenToProducts());
  const unsubscribe2 = dispatch(listenToWishlist()); // ✅ ADD THIS

  return () => {
    unsubscribe1 && unsubscribe1();
    unsubscribe2 && unsubscribe2();
  };
}, [dispatch]);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/category/all?search=${search}`);
    }
  };
  const wishlist = useSelector((state) => state.wishlist.items);
  const isWishlisted = (productId) =>
  wishlist.some((item) => item.productId === productId);
  

  const availableProducts = products.filter((p) => !p.sold);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏠 Home</h2>

      {/* 🔍 Search */}
      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 📦 Categories */}
      <h3>Categories</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => navigate(`/category/${cat.name}`)}
            style={{
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                background: "#f2f4f5",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: "60px", height: "60px" }}
              />
            </div>
            <p style={{ marginTop: "10px" }}>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* 🛍️ PRODUCTS (OLX STYLE) */}
      <h3 style={{ marginTop: "40px" }}>Fresh Recommendations</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {availableProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff",
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            {/* Image */}
            <div style={{ position: "relative" }}>
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
              />

          <span
            onClick={(e) => {
              e.stopPropagation();

              const item = wishlist.find(
                (w) => w.productId === product.id
              );

              if (item) {
                dispatch(removeFromWishlist(item.id));
              } else {
                dispatch(addToWishlist(product));
              }
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "22px",
              background: "#fff",
              borderRadius: "50%",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            {isWishlisted(product.id) ? "❤️" : "🤍"}
          </span>
            </div>

            {/* Details */}
            <div style={{ padding: "10px" }}>
              <h3 style={{ margin: "5px 0" }}>₹{product.price}</h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  height: "40px",
                  overflow: "hidden",
                }}
              >
                {product.title}
              </p>

              <p style={{ fontSize: "12px", color: "#888" }}>
                {product.category}
              </p>

              {/* Fake location */}
              <p style={{ fontSize: "12px", color: "#999" }}>
                📍 India
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCartFirestore } from "../features/cart/cartSlice";
import { listenToProducts } from "../features/products/productSlice";


function Products() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  
  useEffect(() => {
    const unsubscribe = dispatch(listenToProducts());
    return () => unsubscribe();
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const exists = cartItems.find((item) => item.id === product.id);

    if (exists) {
      alert("Item already in cart ⚠️");
    } else {
      dispatch(addToCartFirestore(product));
    }
  };

const filteredProducts = products
  .filter((p) => !p.sold) // ✅ hide sold items
  .filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter((p) =>
    category === "All" ? true : p.category === category
  );

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Products</h2>

      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      
      <p style={{ fontWeight: "bold" }}>
        🛒 Cart Items: {cartItems.length}
      </p>

      {filteredProducts.length === 0 && <p>No products available</p>}

    
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => {
          const inCart = cartItems.some(
            (item) => item.id === product.id
          );

          return (
            <div
              key={product.id}
              style={{
                border: "1px solid #eee",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <h3>{product.title}</h3>

              <p style={{ color: "green", fontWeight: "bold" }}>
                ₹{product.price}
              </p>

              <p style={{ fontSize: "14px", color: "#555" }}>
                {product.description}
              </p>

              <p style={{ fontStyle: "italic" }}>
                {product.category}
              </p>

              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={inCart}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: inCart ? "gray" : "#002f34",
                  color: "white",
                }}
              >
                {inCart ? "✔ Added" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
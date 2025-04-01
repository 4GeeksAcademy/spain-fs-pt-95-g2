import React, { useEffect, useState } from "react";

const ExternalProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/external/products`)
      .then(res => {
        if (!res.ok) throw new Error("Error loading products");
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p className="text-center">{error}</p>;
  if (!products.length) return <p className="text-center">Loading products...</p>;

  return (
    <div className="products-container">
      <h1 className="titulo">External products</h1>
      <div className="product-grid">
        {products.map((product, idx) => (
          <div className="product-card" key={idx}>
            <img src={product.image} alt={product.name} className="product-img" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-category">{product.category}</p>
            <p className="product-price">{product.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalProducts;

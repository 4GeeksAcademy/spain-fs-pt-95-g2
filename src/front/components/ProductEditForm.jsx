// src/components/ProductEditForm.jsx
import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";

const ProductEditForm = ( {product , onUpdate , onCancel}) => {
  const { updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if(product) {
      setFormData({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      });
    };
  }, [product]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateProduct(product.id_product, formData);
      onUpdate();
    } catch (error) {
      setError("Error al actualizar el producto");
    }
  };

  if (!product) {
    return <p className="text-muted">Cargando producto...</p>
  }

  return (
    <form onSubmit={handleFormSubmit} className="p-4 m-5">
      <h5>Editar producto: {product.name}</h5>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-2">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name || ""}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="mb-2">
        <label htmlFor="price" className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price || ""}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="mb-2">
        <label htmlFor="quantity" className="form-label">Quantity</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={formData.quantity || ""}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-success" type="submit">Guardar cambios</button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default ProductEditForm;

import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ModalAddCategory from "./ModalAddCategory";

const ProductForm = ({ onSuccess , onCancel }) => {
  const { createProduct, error, setError } = useProducts();
  const { categories, setCategories, createCategory, fetchCategories } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    image_url: "",
    category_id: "",
    inventories_id: "1",
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id" && value === "new") {
      setShowCategoryModal(true);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleModalSave = async (newCatData) => {
    try {
      const newCat = await createCategory(newCatData);
      setCategories([...categories, newCat]);
      setFormData((prev) => ({...prev, category_id: newCat.id_category}));
    } catch (error){
      alert("No se pudo crear la categoria");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const productNew = await createProduct(formData);
      onSuccess && onSuccess(productNew);
      onCancel && onCancel();
      setFormData({
        name: "",
        price: "",
        quantity: "",
        image_url: "",
        category_id: "",
        inventories_id: ""
      });
    } catch (error) {
      console.log("error", error)
      setError("Error al crear el producto");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "easyInventory");
    data.append("cloud_name", "dttjh1qaf");
    try{
      const response = await fetch("https://api.cloudinary.com/v1_1/dttjh1qaf/image/upload", {
        method: "POST",
        body: data,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error", errorData);
      return
    }
    const result = await response.json();
    const imageURL = result.secure_url;

    setFormData((prev) => ({
      ...prev,
      image_url: imageURL,
  }));
} catch (error) {
  console.error("Error uploading image to Cloudinary", error);
}
};

  return (
    <form className="m-5 p-3" onSubmit={handleFormSubmit}>
      <h4 className="mb-3">Crear nuevo producto</h4>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-2">
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          className="form-control"
          value={formData.name}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="mb-2">
        <input
          type="number"
          name="price"
          placeholder="Precio"
          className="form-control"
          value={formData.price}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="mb-2">
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          className="form-control"
          value={formData.quantity}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="mb-2">
        <input
        type="file"
        name="image_url"
        className="form-control"
        accept="image/*"
        onChange={handleFileChange}
        required
        />
      </div>

      <div className="mb-2">
        <select
          name="category_id"
          className="form-select"
          value={formData.category_id}
          onChange={handleFormChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id_category} value={cat.id_category}>
              {cat.name}
            </option>
          ))}
          <option value="new" > + nueva categoria</option>
        </select>
      </div>

      <ModalAddCategory show={showCategoryModal} onClose={() => setShowCategoryModal(false)} onSave={handleModalSave}/>
      
      <div className="d-flex justify-content-between">
        <button className="mx-2 btn btn-success" type="submit">
        Guardar producto
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
      </div>
      
    </form>
  );
}

export default ProductForm;
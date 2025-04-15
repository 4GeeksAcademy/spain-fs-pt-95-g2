import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const { products, fetchProducts, deleteProduct, loading, error } = useProducts();
  const navigate = useNavigate();

  const handleFormEdit = (product) => {
    navigate(`/products/edit/${product.id_product}`);
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  const handleFormDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este producto?");
    if (!confirm) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Productos</h2>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="bg-dark text-white">ID</th>
              <th className="bg-dark text-white">Name</th>
              <th className="bg-dark text-white">Price</th>
              <th className="bg-dark text-white">Quantity</th>
              <th className="bg-dark text-white">Accion</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id_product}>
                <td>{product.id_product}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="mx-2" onClick={() => handleFormEdit(product)}>Edit</button>
                  <button onClick={() => handleFormDelete(product.id_product)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/products/create")}
        >
          Crear Producto
        </button>
      </div>
    </div>
  );
};

export default ProductList;

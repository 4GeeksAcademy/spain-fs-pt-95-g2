import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductEditForm from "../components/ProductEditForm";
import ProductForm from "../components/ProductForm";

const ProductList = () => {
  const { products, fetchProducts, deleteProduct, loading } = useProducts();
  const [productEdit, setProductEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      {productEdit ? (
        <ProductEditForm
          product={productEdit}
          onUpdate={() => {
            fetchProducts();
            setProductEdit(null)
          }}
          onCancel={() => {
            fetchProducts();
            setProductEdit(null)
          }
          }
        />
      ) : showCreateForm ? (
        <ProductForm
          onSuccess={() => {
            fetchProducts();
            setShowCreateForm(false)
          }}
          onCancel={() => {
            setShowCreateForm(false)
          }}
        />
      ) : (
        <>
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
                      <button className="mx-2" onClick={() => setProductEdit(product)}>Edit</button>
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
              onClick={() => setShowCreateForm(true)}
            >
              Crear Producto
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;

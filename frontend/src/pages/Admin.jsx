import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TabNavigation from "../components/TabNavigation";
import OrdersManagement from "../components/OrdersManagement";
import CatalogManagement from "../components/CatalogManagement";
import EditProductModal from "../components/EditProductModal";

function Admin({ products, setProducts }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(await response.json());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleEditSubmit = async (updatedProduct) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProductData = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProductData.id ? updatedProductData : product
        )
      );

      setIsEditing(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="tab-content">
        {activeTab === "orders" && (
          <OrdersManagement
            orders={orders}
            setOrders={setOrders}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
          />
        )}
        {activeTab === "catalog" && (
          <CatalogManagement
            products={products}
            setProducts={setProducts}
            onEditClick={handleEditClick}
          />
        )}
      </div>

      {isEditing && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setIsEditing(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}

Admin.propTypes = {
  products: PropTypes.array.isRequired,
  setProducts: PropTypes.func.isRequired,
};

export default Admin;
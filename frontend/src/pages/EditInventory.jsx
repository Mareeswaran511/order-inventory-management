import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInventoryById,
  updateInventory,
} from "../services/inventoryService";

import { getProducts } from "../services/productService";
import { getWarehouses } from "../services/warehouseService";

function EditInventory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [inventoryData, productData, warehouseData] =
          await Promise.all([
            getInventoryById(id),
            getProducts(),
            getWarehouses(),
          ]);

        setFormData({
          productId: inventoryData.productId,
          warehouseId: inventoryData.warehouseId,
          quantity: inventoryData.quantity,
        });

        setProducts(productData.content || productData);
        setWarehouses(warehouseData.content || warehouseData);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        setError("Failed to load inventory details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      setError("Please select a product.");
      return;
    }

    if (!formData.warehouseId) {
      setError("Please select a warehouse.");
      return;
    }

    if (formData.quantity === "" || Number(formData.quantity) < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateInventory(id, {
        productId: Number(formData.productId),
        warehouseId: Number(formData.warehouseId),
        quantity: Number(formData.quantity),
      });

      navigate("/inventory");
    } catch (err) {
      console.error("Failed to update inventory:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update inventory.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
  className="container-fluid py-5 min-vh-100 text-center"
  style={{ backgroundColor: "#eef2f7" }}
>
        <div className="spinner-border text-primary"></div>
        <p className="text-muted mt-2">
          Loading inventory details...
        </p>
      </div>
    );
  }

  return (
    <div
  className="container-fluid py-4 min-vh-100"
  style={{ backgroundColor: "#eef2f7" }}
>

      {/* Header */}
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-3"
          onClick={() => navigate("/inventory")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Inventory
        </button>

        <h3 className="fw-bold mb-1">Edit Inventory</h3>
        <p className="text-muted mb-0">
          Update product stock information.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="card bg-white border rounded-3 shadow-sm">
        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            {/* Product */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Product
              </label>

              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (ID: {product.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Warehouse */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Warehouse
              </label>

              <select
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Warehouse</option>

                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className="form-control"
                placeholder="Enter quantity"
              />
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigate("/inventory")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                    ></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Update Inventory
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditInventory;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInventory } from "../services/inventoryService";
import { getProducts } from "../services/productService";
import { getWarehouses } from "../services/warehouseService";

function AddInventory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, warehouseData] = await Promise.all([
          getProducts(),
          getWarehouses(),
        ]);

        setProducts(productData.content || productData);
        setWarehouses(warehouseData.content || warehouseData);
      } catch (err) {
        console.error("Failed to load products/warehouses:", err);
        setError("Failed to load products and warehouses.");
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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
      setLoading(true);

      await createInventory({
        productId: Number(formData.productId),
        warehouseId: Number(formData.warehouseId),
        quantity: Number(formData.quantity),
      });

      navigate("/inventory");
    } catch (err) {
      console.error("Failed to create inventory:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div
  className="container-fluid py-5 min-vh-100 text-center"
  style={{ backgroundColor: "#eef2f7" }}
>
        <div className="spinner-border text-primary"></div>
        <p className="text-muted mt-2">
          Loading products and warehouses...
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

        <h3 className="fw-bold mb-1">
          Add Inventory
        </h3>

        <p className="text-muted mb-0">
          Add stock for a product in a warehouse.
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

            <div className="row g-4">

              {/* Product */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Product
                </label>

                <select
                  className="form-select"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} (ID: {product.id})
                    </option>
                  ))}
                </select>

              </div>

              {/* Warehouse */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Warehouse
                </label>

                <select
                  className="form-select"
                  name="warehouseId"
                  value={formData.warehouseId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Warehouse
                  </option>

                  {warehouses.map((warehouse) => (
                    <option
                      key={warehouse.id}
                      value={warehouse.id}
                    >
                      {warehouse.name} ({warehouse.code})
                    </option>
                  ))}
                </select>

              </div>

              {/* Quantity */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Quantity
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Add Inventory
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

export default AddInventory;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    reorderLevel: "",
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getProductById(id);

        setFormData({
          sku: product.sku || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          reorderLevel: product.reorderLevel ?? "",
          active: product.active ?? true,
        });
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        reorderLevel: Number(formData.reorderLevel),
      });

      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Failed to update product:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
  className="container-fluid py-4 min-vh-100"
  style={{ backgroundColor: "#eef2f7" }}
>
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body text-center py-4">

            <div
              className="spinner-border spinner-border-sm text-primary mb-2"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <div className="text-muted">
              Loading product...
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div className="d-flex align-items-center gap-3">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Dashboard
          </button>

          <div>
            <h3 className="fw-bold mb-0">
              Edit Product
            </h3>

            <small className="text-muted">
              Update product and SKU information
            </small>
          </div>

        </div>

        <div className="d-flex gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/products")}
            disabled={saving}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Products
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(`/products/${id}`)}
            disabled={saving}
          >
            <i className="bi bi-eye me-1"></i>
            Details
          </button>

        </div>

      </div>

      {/* =========================
          EDIT FORM CARD
      ========================= */}
      <div className="card border-0 shadow-sm">

        {/* CARD HEADER */}
        <div className="card-header bg-white border-bottom py-3">

          <div className="d-flex align-items-center gap-3">

            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-pencil-square fs-4"></i>
            </div>

            <div>
              <h5 className="fw-bold mb-0">
                Product Information
              </h5>

              <small className="text-muted">
                Update the details for this product
              </small>
            </div>

          </div>

        </div>

        {/* FORM BODY */}
        <div className="card-body py-3">

          <form onSubmit={handleSubmit}>

            <div className="row g-2">

              {/* SKU */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  className="form-control"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PRODUCT NAME */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PRICE */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  Price
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />

                </div>

              </div>

              {/* REORDER LEVEL */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  Reorder Level
                </label>

                <input
                  type="number"
                  name="reorderLevel"
                  className="form-control"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div className="col-12">

                <label className="form-label fw-semibold mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                />

              </div>

              {/* ACTIVE PRODUCT */}
              <div className="col-12">

                <div className="form-check mt-1">

                  <input
                    type="checkbox"
                    name="active"
                    className="form-check-input"
                    id="editActiveProduct"
                    checked={formData.active}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="editActiveProduct"
                  >
                    Active Product
                  </label>

                </div>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="alert alert-danger py-2 mt-2 mb-0">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div className="d-flex justify-content-end gap-2 mt-3">

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigate(`/products/${id}`)}
                disabled={saving}
              >
                <i className="bi bi-x-lg me-1"></i>
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
                      role="status"
                    ></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    Update Product
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

export default EditProduct; 
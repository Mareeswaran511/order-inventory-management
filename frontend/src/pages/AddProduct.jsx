import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";
import ToastMessage from "../components/ToastMessage";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    reorderLevel: "",
    active: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast((previousToast) => ({
      ...previousToast,
      show: false,
    }));
  };

  const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (typeof responseData === "string") {
      return responseData;
    }

    if (error?.message) {
      return error.message;
    }

    return "Failed to create product.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    closeToast();

    try {
      setLoading(true);

      const productData = {
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        reorderLevel: Number(formData.reorderLevel),
        active: formData.active,
      };

      await createProduct(productData);

      showToast("Product created successfully.", "success");

      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (error) {
      console.error("Failed to create product:", error);

      const message = getErrorMessage(error);

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-4 min-vh-100"
      style={{ backgroundColor: "#eef2f7" }}
    >
      {/* =========================
          TOAST
      ========================= */}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
      />

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
              Add Product
            </h3>

            <small className="text-muted">
              Create a new product and SKU
            </small>
          </div>

        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/products")}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Products
        </button>

      </div>

      {/* =========================
          FORM CARD
      ========================= */}
      <div className="card bg-white border rounded-3 shadow-sm">

        {/* CARD HEADER */}
        <div className="card-header bg-white border-bottom py-3">

          <div className="d-flex align-items-center gap-2">

            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-box-seam fs-5"></i>
            </div>

            <div>
              <h5 className="fw-bold mb-0">
                Product Information
              </h5>

              <small className="text-muted">
                Enter product details
              </small>
            </div>

          </div>

        </div>

        {/* FORM BODY */}
        <div className="card-body p-4">

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
                  placeholder="Enter SKU"
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
                  placeholder="Enter product name"
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
                    placeholder="Enter price"
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
                  placeholder="Enter reorder level"
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
                  placeholder="Enter product description"
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
                    id="activeProduct"
                    checked={formData.active}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="activeProduct"
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
                onClick={() => navigate("/products")}
                disabled={loading}
              >
                <i className="bi bi-x-lg me-1"></i>
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
                      role="status"
                    ></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-1"></i>
                    Create Product
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

export default AddProduct;
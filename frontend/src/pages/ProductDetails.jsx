import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);

        console.log("Product details:", data);

        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
  className="container-fluid py-4 min-vh-100"
  style={{ backgroundColor: "#eef2f7" }}
>
        <div className="card border-0 shadow-sm">
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

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="container-fluid py-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-4">

            <i className="bi bi-exclamation-circle text-danger fs-3"></i>

            <h6 className="mt-2">
              Unable to Load Product
            </h6>

            <p className="text-muted small mb-3">
              {error}
            </p>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/products")}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Products
            </button>

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
              Product Details
            </h3>

            <small className="text-muted">
              View complete product information
            </small>
          </div>

        </div>

        <div className="d-flex gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/products")}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Products
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate(`/products/${product.id}/edit`)
            }
          >
            <i className="bi bi-pencil me-1"></i>
            Edit Product
          </button>

        </div>

      </div>

      {/* =========================
          PRODUCT DETAILS CARD
      ========================= */}
      <div className="card border-0 shadow-sm">

        {/* PRODUCT HEADER */}
        <div className="card-header bg-white border-bottom py-3">

          <div className="d-flex align-items-center gap-3">

            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-box-seam fs-4"></i>
            </div>

            <div>

              <h4 className="fw-bold mb-0">
                {product.name}
              </h4>

              <small className="text-muted">
                SKU: {product.sku}
              </small>

            </div>

          </div>

        </div>

        {/* =========================
            INFORMATION
        ========================= */}
        <div className="card-body py-3">

          <div className="row g-2">

            {/* PRODUCT ID */}
            <div className="col-md-3">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Product ID
                </small>

                <span className="fw-semibold">
                  #{product.id}
                </span>
              </div>
            </div>

            {/* SKU */}
            <div className="col-md-3">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  SKU
                </small>

                <span
                  className="fw-semibold text-truncate d-block"
                  title={product.sku}
                >
                  {product.sku}
                </span>
              </div>
            </div>

            {/* PRODUCT NAME */}
            <div className="col-md-3">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Product Name
                </small>

                <span
                  className="fw-semibold text-truncate d-block"
                  title={product.name}
                >
                  {product.name}
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div className="col-md-3">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block mb-1">
                  Status
                </small>

                {product.active ? (
                  <span className="badge text-bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Active
                  </span>
                ) : (
                  <span className="badge text-bg-secondary">
                    <i className="bi bi-x-circle me-1"></i>
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* PRICE */}
            <div className="col-md-3">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Price
                </small>

                <span className="fw-semibold">
                  ₹{product.price}
                </span>
              </div>
            </div>

            {/* REORDER LEVEL */}
            <div className="col-md-3">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Reorder Level
                </small>

                <span className="fw-semibold">
                  {product.reorderLevel}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="col-md-6">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Description
                </small>

                <span
                  className="text-truncate d-block"
                  title={
                    product.description ||
                    "No description available"
                  }
                >
                  {product.description ||
                    "No description available"}
                </span>
              </div>
            </div>

            {/* CREATED AT */}
            <div className="col-md-6">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Created At
                </small>

                <span className="text-muted small">
                  {product.createdAt || "-"}
                </span>
              </div>
            </div>

            {/* UPDATED AT */}
            <div className="col-md-6">
              <div className="border rounded px-3 py-2">
                <small className="text-muted d-block">
                  Updated At
                </small>

                <span className="text-muted small">
                  {product.updatedAt || "-"}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================
            FOOTER
        ========================= */}
        <div className="card-footer bg-white py-2 d-flex justify-content-end gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/products")}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Products
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate(`/products/${product.id}/edit`)
            }
          >
            <i className="bi bi-pencil me-1"></i>
            Edit Product
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
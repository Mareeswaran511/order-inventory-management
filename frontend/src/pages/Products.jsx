import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
} from "../services/productService";
import CommonTable from "../components/CommonTable";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();

        console.log("Products API response:", data);

        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name?.toLowerCase().includes(search) ||
      product.sku?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search)
    );
  });

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  return (
    <div
      className="container-fluid py-4 min-vh-100"
      style={{ backgroundColor: "#eef2f7" }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>

          <div>
            <h2 className="fw-bold mb-1">
              Products
            </h2>

            <p className="text-muted mb-0">
              Manage products and SKU information
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/products/add")}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Product
        </button>
      </div>

      {/* =========================
          PRODUCT CARD
      ========================= */}
      <div className="card bg-white border rounded-3 shadow-sm">
        {/* Card Header */}
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-1">
                Product List
              </h5>

              <small className="text-muted">
                {products.length} product
                {products.length !== 1 ? "s" : ""} available
              </small>
            </div>

            {/* Search */}
            <div
              className="input-group"
              style={{ maxWidth: "320px" }}
            >
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-muted"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchTerm("")}
                  title="Clear Search"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="card-body text-center py-5">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <h6 className="text-muted mb-0">
              Loading products...
            </h6>
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {!loading && error && (
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-circle text-danger fs-1"></i>

            <h5 className="mt-3">
              Unable to Load Products
            </h5>

            <p className="text-muted mb-0">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            PRODUCT TABLE
        ========================= */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length > 0 && (
            <CommonTable
              headers={[
                "ID",
                "SKU",
                "Product Name",
                "Description",
                "Price",
                "Reorder Level",
                "Status",
                "Actions",
              ]}
            >
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  {/* ID */}
                  <td className="px-4">
                    <span className="text-muted">
                      #{product.id}
                    </span>
                  </td>

                  {/* SKU */}
                  <td>
                    <span className="fw-semibold">
                      {product.sku}
                    </span>
                  </td>

                  {/* Product Name */}
                  <td>
                    <span className="fw-semibold">
                      {product.name}
                    </span>
                  </td>

                  {/* Description */}
                  <td>
                    <span className="text-muted">
                      {product.description || "-"}
                    </span>
                  </td>

                  {/* Price */}
                  <td>
                    <span className="fw-semibold">
                      ₹
                      {Number(product.price).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </td>

                  {/* Reorder Level */}
                  <td>
                    {product.reorderLevel}
                  </td>

                  {/* Status */}
                  <td>
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
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {/* View */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        title="View Product"
                        onClick={() =>
                          navigate(
                            `/products/${product.id}`
                          )
                        }
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        title="Edit Product"
                        onClick={() =>
                          navigate(
                            `/products/${product.id}/edit`
                          )
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Product"
                        onClick={() =>
                          handleDelete(product)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </CommonTable>
          )}

        {/* =========================
            NO SEARCH RESULTS
        ========================= */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="card-body text-center py-5">
              <i className="bi bi-search text-muted fs-1"></i>

              <h5 className="mt-3">
                No Matching Products
              </h5>

              <p className="text-muted mb-3">
                No products match your search.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            </div>
          )}

        {/* =========================
            NO PRODUCTS
        ========================= */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="card-body text-center py-5">
              <i className="bi bi-box-seam text-muted fs-1"></i>

              <h5 className="mt-3">
                No Products Found
              </h5>

              <p className="text-muted mb-3">
                No products are available.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  navigate("/products/add")
                }
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Your First Product
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default Products;
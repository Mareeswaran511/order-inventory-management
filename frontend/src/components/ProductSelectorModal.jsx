import { useEffect, useState } from "react";

function ProductSelectorModal({
  show,
  products,
  selectedProductId,
  onSelect,
  onClose,
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) {
      setSearch("");
    }
  }, [show]);

  if (!show) return null;

  const searchText = search.toLowerCase().trim();

  const filteredProducts = products.filter((product) => {
    if (!searchText) return true;

    return (
      product.sku?.toLowerCase().includes(searchText) ||
      product.name?.toLowerCase().includes(searchText) ||
      String(product.id).includes(searchText)
    );
  });

  const handleSelect = (product) => {
    onSelect(product);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 rounded-4 shadow-lg">

            {/* ================= HEADER ================= */}
            <div className="modal-header px-4 py-3 border-bottom">
              <div className="d-flex align-items-center gap-3">

                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary"
                  style={{
                    width: "46px",
                    height: "46px",
                  }}
                >
                  <i className="bi bi-box-seam fs-4"></i>
                </div>

                <div>
                  <h5 className="modal-title fw-bold mb-1">
                    Select Product
                  </h5>

                  <div className="text-muted small">
                    Search and select a product for this order item
                  </div>
                </div>

              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* ================= SEARCH SECTION ================= */}
            <div className="modal-body p-4">

              <div className="card border rounded-3 shadow-sm mb-4">
                <div className="card-body p-3">

                  <div className="row g-3 align-items-end">

                    {/* Search */}
                    <div className="col-md-8">
                      <label className="form-label fw-semibold mb-2">
                        Search Product
                      </label>

                      <div className="input-group">

                        <span className="input-group-text bg-white">
                          <i className="bi bi-search text-muted"></i>
                        </span>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by SKU, product name or ID..."
                          value={search}
                          onChange={(event) =>
                            setSearch(event.target.value)
                          }
                          autoFocus
                        />

                        {search && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setSearch("")}
                            title="Clear search"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}

                      </div>
                    </div>

                    {/* Result Count */}
                    <div className="col-md-4">
                      <div className="text-md-end">

                        <div className="small text-muted mb-1">
                          Available Products
                        </div>

                        <span className="badge bg-light text-dark border px-3 py-2">
                          <i className="bi bi-box me-1"></i>
                          {filteredProducts.length} result
                          {filteredProducts.length !== 1 ? "s" : ""}
                        </span>

                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* ================= PRODUCT TABLE ================= */}
              <div className="border rounded-3 overflow-hidden">

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">
                      <tr>
                        <th className="px-4 py-3 small text-uppercase text-muted">
                          Product
                        </th>

                        <th className="py-3 small text-uppercase text-muted">
                          SKU
                        </th>

                        <th className="py-3 small text-uppercase text-muted">
                          Product ID
                        </th>

                        <th className="py-3 small text-uppercase text-muted">
                          Price
                        </th>

                        <th className="text-end px-4 py-3 small text-uppercase text-muted">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-5 text-center">

                            <div className="text-muted">

                              <i className="bi bi-search fs-1 d-block mb-3"></i>

                              <h6 className="fw-semibold mb-1">
                                No products found
                              </h6>

                              <p className="small mb-0">
                                Try searching with a different SKU,
                                product name or product ID.
                              </p>

                            </div>

                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {

                          const isSelected =
                            Number(selectedProductId) ===
                            Number(product.id);

                          return (
                            <tr
                              key={product.id}
                              className={
                                isSelected
                                  ? "table-primary"
                                  : ""
                              }
                            >

                              {/* Product */}
                              <td className="px-4 py-3">

                                <div className="d-flex align-items-center gap-3">

                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-2 bg-light text-secondary"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                    }}
                                  >
                                    <i className="bi bi-box"></i>
                                  </div>

                                  <div>
                                    <div className="fw-semibold">
                                      {product.name}
                                    </div>

                                    <div className="small text-muted">
                                      Product
                                    </div>
                                  </div>

                                </div>

                              </td>

                              {/* SKU */}
                              <td>

                                <span className="badge bg-light text-dark border px-2 py-2">
                                  <i className="bi bi-upc-scan me-1"></i>
                                  {product.sku}
                                </span>

                              </td>

                              {/* ID */}
                              <td>
                                <span className="text-muted">
                                  #{product.id}
                                </span>
                              </td>

                              {/* Price */}
                              <td>
                                <span className="fw-semibold">
                                  ₹
                                  {Number(
                                    product.price || 0
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </td>

                              {/* Action */}
                              <td className="text-end px-4">

                                <button
                                  type="button"
                                  className={
                                    isSelected
                                      ? "btn btn-success btn-sm px-3"
                                      : "btn btn-primary btn-sm px-3"
                                  }
                                  onClick={() =>
                                    handleSelect(product)
                                  }
                                >
                                  <i
                                    className={
                                      isSelected
                                        ? "bi bi-check-circle me-1"
                                        : "bi bi-check2 me-1"
                                    }
                                  ></i>

                                  {isSelected
                                    ? "Selected"
                                    : "Select"}
                                </button>

                              </td>

                            </tr>
                          );
                        })
                      )}

                    </tbody>

                  </table>
                </div>

              </div>

              {/* ================= SELECTED INFO ================= */}
              {selectedProductId && (
                <div className="alert alert-primary d-flex align-items-center gap-2 mt-3 mb-0 py-2">

                  <i className="bi bi-info-circle"></i>

                  <div className="small">
                    A product is currently selected for this order item.
                    You can select another product to change it.
                  </div>

                </div>
              )}

            </div>

            {/* ================= FOOTER ================= */}
            <div className="modal-footer px-4 py-3 border-top">

              <div className="me-auto text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                Select a product to continue.
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
              >
                <i className="bi bi-x-lg me-1"></i>
                Close
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ProductSelectorModal;
import { useEffect, useState } from "react";

function WarehouseSelectorModal({
  show,
  warehouses,
  selectedWarehouseId,
  onSelect,
  onClose,
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) {
      setSearch("");
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const searchText = search.toLowerCase().trim();

  const filteredWarehouses = warehouses.filter((warehouse) => {
    if (!searchText) {
      return true;
    }

    return (
      warehouse.name?.toLowerCase().includes(searchText) ||
      warehouse.code?.toLowerCase().includes(searchText) ||
      String(warehouse.id).includes(searchText) ||
      warehouse.address?.toLowerCase().includes(searchText)
    );
  });

  return (
    <>
      {/* Backdrop */}
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
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 rounded-4 shadow-lg">

            {/* Header */}
            <div className="modal-header px-4 py-3 border-bottom">
              <div className="d-flex align-items-center gap-3">

                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary"
                  style={{
                    width: "44px",
                    height: "44px",
                  }}
                >
                  <i className="bi bi-building fs-5"></i>
                </div>

                <div>
                  <h5 className="modal-title fw-bold mb-1">
                    Select Warehouse
                  </h5>

                  <small className="text-muted">
                    Search and select a warehouse
                  </small>
                </div>

              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">

              {/* Search */}
              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Search Warehouse
                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, code or ID..."
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

              {/* Result count */}
              <div className="d-flex justify-content-between align-items-center mb-2">

                <small className="text-muted">
                  Available Warehouses
                </small>

                <span className="badge bg-light text-dark border">
                  {filteredWarehouses.length} result
                  {filteredWarehouses.length !== 1 ? "s" : ""}
                </span>

              </div>

              {/* Table */}
              <div className="border rounded-3 overflow-hidden">

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">
                      <tr>
                        <th className="px-3 py-3 small text-uppercase text-muted">
                          Warehouse
                        </th>

                        <th className="py-3 small text-uppercase text-muted">
                          Code
                        </th>

                        <th className="py-3 small text-uppercase text-muted">
                          ID
                        </th>

                        <th className="text-end px-3 py-3 small text-uppercase text-muted">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredWarehouses.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-5"
                          >
                            <i className="bi bi-building fs-1 text-muted d-block mb-3"></i>

                            <h6 className="fw-semibold mb-1">
                              No warehouses found
                            </h6>

                            <p className="text-muted small mb-0">
                              Try a different warehouse name,
                              code or ID.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredWarehouses.map((warehouse) => {
                          const isSelected =
                            Number(selectedWarehouseId) ===
                            Number(warehouse.id);

                          return (
                            <tr
                              key={warehouse.id}
                              className={
                                isSelected
                                  ? "table-primary"
                                  : ""
                              }
                            >

                              {/* Warehouse */}
                              <td className="px-3 py-3">

                                <div className="d-flex align-items-center gap-3">

                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-2 bg-light text-secondary"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                    }}
                                  >
                                    <i className="bi bi-building"></i>
                                  </div>

                                  <div>
                                    <div className="fw-semibold">
                                      {warehouse.name}
                                    </div>

                                    {warehouse.address && (
                                      <div className="small text-muted">
                                        {warehouse.address}
                                      </div>
                                    )}
                                  </div>

                                </div>

                              </td>

                              {/* Code */}
                              <td>
                                <span className="badge bg-light text-dark border">
                                  {warehouse.code}
                                </span>
                              </td>

                              {/* ID */}
                              <td>
                                <span className="text-muted">
                                  #{warehouse.id}
                                </span>
                              </td>

                              {/* Action */}
                              <td className="text-end px-3">

                                <button
                                  type="button"
                                  className={
                                    isSelected
                                      ? "btn btn-success btn-sm px-3"
                                      : "btn btn-primary btn-sm px-3"
                                  }
                                  onClick={() =>
                                    onSelect(warehouse)
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

            </div>

            {/* Footer */}
            <div className="modal-footer px-4 py-3">

              <div className="me-auto text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                Select a warehouse for this order item.
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
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

export default WarehouseSelectorModal;
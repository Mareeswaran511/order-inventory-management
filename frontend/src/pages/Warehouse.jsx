import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWarehouses,
  deleteWarehouse,
} from "../services/warehouseService";
import CommonTable from "../components/CommonTable";

function Warehouse() {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error("Failed to load warehouses:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load warehouses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this warehouse?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteWarehouse(id);

      setWarehouses((previousWarehouses) =>
        previousWarehouses.filter(
          (warehouse) => warehouse.id !== id
        )
      );
    } catch (error) {
      console.error("Failed to delete warehouse:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete warehouse."
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            <i className="bi bi-arrow-left me-1"></i>
            Dashboard
          </button>

          <div>
            <h3 className="fw-bold mb-0">
              Warehouses
            </h3>

            <small className="text-muted">
              Manage warehouse locations and information
            </small>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/warehouses/add")}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Add Warehouse
        </button>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center py-2 mb-3"
          role="alert"
        >
          <i className="bi bi-exclamation-circle me-2"></i>

          <span>{error}</span>
        </div>
      )}

      {/* =========================
          WAREHOUSE CARD
      ========================= */}
      <div className="card bg-white border rounded-3 shadow-sm">
        {/* Card Header */}
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-building text-primary"></i>

            <span className="fw-bold">
              Warehouse List
            </span>

            <span className="badge bg-secondary">
              {warehouses.length}
            </span>
          </div>
        </div>

        {/* =========================
            CARD BODY
        ========================= */}
        <div className="card-body p-0">
          {/* =========================
              LOADING
          ========================= */}
          {loading ? (
            <div className="text-center py-4">
              <div
                className="spinner-border spinner-border-sm text-primary mb-2"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <div className="text-muted">
                Loading warehouses...
              </div>
            </div>
          ) : warehouses.length === 0 ? (
            /* =========================
               EMPTY STATE
            ========================= */
            <div className="text-center py-5">
              <i className="bi bi-building fs-1 text-muted"></i>

              <h6 className="mt-3">
                No warehouses found
              </h6>

              <p className="text-muted mb-3">
                Create your first warehouse to get started.
              </p>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  navigate("/warehouses/add")
                }
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add Warehouse
              </button>
            </div>
          ) : (
            /* =========================
               WAREHOUSE TABLE
            ========================= */
            <CommonTable
              headers={[
                "ID",
                "Code",
                "Warehouse Name",
                "Location",
                "Actions",
              ]}
            >
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  {/* ID */}
                  <td>
                    <span className="text-muted">
                      #{warehouse.id}
                    </span>
                  </td>

                  {/* Code */}
                  <td>
                    <span
                      className="fw-semibold text-truncate d-block"
                      title={warehouse.code}
                    >
                      {warehouse.code}
                    </span>
                  </td>

                  {/* Warehouse Name */}
                  <td>
                    <span
                      className="text-truncate d-block"
                      title={warehouse.name}
                    >
                      {warehouse.name}
                    </span>
                  </td>

                  {/* Location */}
                  <td>
                    <span
                      className="text-truncate d-block text-muted"
                      title={warehouse.location}
                    >
                      {warehouse.location || "-"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {/* View */}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(
                            `/warehouses/${warehouse.id}`
                          )
                        }
                        title="View Warehouse"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm"
                        onClick={() =>
                          navigate(
                            `/warehouses/${warehouse.id}/edit`
                          )
                        }
                        title="Edit Warehouse"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleDelete(warehouse.id)
                        }
                        title="Delete Warehouse"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </CommonTable>
          )}
        </div>
      </div>
    </div>
  );
}

export default Warehouse;
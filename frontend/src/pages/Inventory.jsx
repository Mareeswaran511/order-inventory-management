import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInventory,
  deleteInventory,
} from "../services/inventoryService";
import CommonTable from "../components/CommonTable";

function Inventory() {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteInventory(id);
      loadInventory();
    } catch (err) {
      console.error("Failed to delete inventory:", err);
      alert("Failed to delete inventory.");
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
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm mb-3"
            onClick={() => navigate("/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </button>

          <h3 className="fw-bold mb-1">
            Inventory
          </h3>

          <p className="text-muted mb-0">
            Manage product stock across warehouses.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/inventory/add")}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Inventory
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
          LOADING
      ========================= */}
      {loading ? (
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-2 mb-0">
              Loading inventory...
            </p>
          </div>
        </div>
      ) : inventory.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-box-seam fs-1 text-muted"></i>

            <h5 className="mt-3">
              No inventory records found
            </h5>

            <p className="text-muted mb-3">
              Add your first inventory record.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/inventory/add")
              }
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add Inventory
            </button>
          </div>
        </div>
      ) : (
        /* =========================
           INVENTORY CARD
        ========================= */
        <div className="card bg-white border rounded-3 shadow-sm">
          {/* Card Header */}
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-box-seam text-primary"></i>

              <span className="fw-bold">
                Inventory List
              </span>

              <span className="badge bg-secondary">
                {inventory.length}
              </span>
            </div>
          </div>

          {/* Common Table */}
          <CommonTable
            headers={[
              "ID",
              "Product ID",
              "Warehouse ID",
              "Quantity",
              "Created",
              "Updated",
              "Actions",
            ]}
          >
            {inventory.map((item) => (
              <tr key={item.id}>
                {/* ID */}
                <td>
                  <span className="text-muted">
                    #{item.id}
                  </span>
                </td>

                {/* Product ID */}
                <td>
                  <span className="fw-semibold">
                    {item.productId}
                  </span>
                </td>

                {/* Warehouse ID */}
                <td>
                  <span className="fw-semibold">
                    {item.warehouseId}
                  </span>
                </td>

                {/* Quantity */}
                <td>
                  <span className="badge bg-primary-subtle text-primary">
                    {item.quantity}
                  </span>
                </td>

                {/* Created */}
                <td>
                  <span className="text-muted small">
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString()
                      : "-"}
                  </span>
                </td>

                {/* Updated */}
                <td>
                  <span className="text-muted small">
                    {item.updatedAt
                      ? new Date(
                          item.updatedAt
                        ).toLocaleString()
                      : "-"}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      title="Edit Inventory"
                      onClick={() =>
                        navigate(
                          `/inventory/${item.id}/edit`
                        )
                      }
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Delete Inventory"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </CommonTable>
        </div>
      )}
    </div>
  );
}

export default Inventory;
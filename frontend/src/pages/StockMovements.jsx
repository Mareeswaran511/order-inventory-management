import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStockMovements } from "../services/stockMovementService";
import CommonTable from "../components/CommonTable";

function StockMovements() {
  const navigate = useNavigate();

  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovements = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getStockMovements();

        setMovements(data);
      } catch (err) {
        console.error(
          "Failed to load stock movements:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load stock movements."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovements();
  }, []);

  const getMovementBadge = (type) => {
    if (type === "IN") {
      return "bg-success";
    }

    if (type === "OUT") {
      return "bg-danger";
    }

    return "bg-secondary";
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
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
            Stock Movements
          </h3>

          <p className="text-muted mb-0">
            Track inventory stock increases and decreases.
          </p>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
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
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mb-0">
              Loading stock movements...
            </p>
          </div>
        </div>
      ) : movements.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3">
              <i className="bi bi-arrow-left-right fs-3"></i>
            </div>

            <h5 className="mt-3">
              No Stock Movements Found
            </h5>

            <p className="text-muted mb-0">
              Inventory movement history will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* =========================
           MOVEMENTS TABLE
        ========================= */
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-arrow-left-right text-primary"></i>

              <span className="fw-bold">
                Movement History
              </span>

              <span className="badge bg-secondary">
                {movements.length}
              </span>
            </div>
          </div>

          <div className="card-body p-0">
            <CommonTable
              headers={[
                "ID",
                "Product ID",
                "Warehouse ID",
                "Movement Type",
                "Quantity",
                "Created At",
              ]}
            >
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="fw-semibold">
                    #{movement.id}
                  </td>

                  <td>
                    {movement.productId}
                  </td>

                  <td>
                    {movement.warehouseId}
                  </td>

                  <td>
                    <span
                      className={`badge ${getMovementBadge(
                        movement.movementType
                      )}`}
                    >
                      {movement.movementType}
                    </span>
                  </td>

                  <td>
                    <span className="fw-semibold">
                      {movement.quantity}
                    </span>
                  </td>

                  <td className="text-nowrap">
                    {formatDateTime(
                      movement.createdAt
                    )}
                  </td>
                </tr>
              ))}
            </CommonTable>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockMovements;
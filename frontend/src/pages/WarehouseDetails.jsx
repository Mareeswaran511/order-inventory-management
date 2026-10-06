import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWarehouseById } from "../services/warehouseService";

function WarehouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWarehouse = async () => {
      try {
        const data = await getWarehouseById(id);
        setWarehouse(data);
      } catch (error) {
        console.error("Failed to load warehouse:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load warehouse."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWarehouse();
  }, [id]);

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
              Loading warehouse...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
  className="container-fluid py-4 min-vh-100"
  style={{ backgroundColor: "#eef2f7" }}
>
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/warehouses")}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Warehouses
        </button>
      </div>
    );
  }

  return (
    <div
  className="container-fluid py-4 min-vh-100"
  style={{ backgroundColor: "#eef2f7" }}
>

      {/* PAGE HEADER */}
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
              Warehouse Details
            </h3>

            <small className="text-muted">
              View warehouse information
            </small>
          </div>

        </div>

        <div className="d-flex gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/warehouses")}
          >
            <i className="bi bi-building me-1"></i>
            Warehouses
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate(`/warehouses/${id}/edit`)
            }
          >
            <i className="bi bi-pencil me-1"></i>
            Edit
          </button>

        </div>

      </div>

      {/* DETAILS CARD */}
      <div className="card bg-white border rounded-3 shadow-sm">

        <div className="card-header bg-white border-bottom py-3">

          <div className="d-flex align-items-center gap-3">

            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-building fs-4"></i>
            </div>

            <div>
              <h5 className="fw-bold mb-0">
                {warehouse.name}
              </h5>

              <small className="text-muted">
                Warehouse Code: {warehouse.code}
              </small>
            </div>

          </div>

        </div>

        <div className="card-body p-4">

          <div className="row g-2">

            {/* ID */}
            <div className="col-md-3">
              <div className="border rounded p-2 h-100">
                <small className="text-muted d-block">
                  Warehouse ID
                </small>

                <span className="fw-semibold">
                  {warehouse.id}
                </span>
              </div>
            </div>

            {/* CODE */}
            <div className="col-md-3">
              <div className="border rounded p-2 h-100">
                <small className="text-muted d-block">
                  Warehouse Code
                </small>

                <span className="fw-semibold">
                  {warehouse.code}
                </span>
              </div>
            </div>

            {/* NAME */}
            <div className="col-md-3">
              <div className="border rounded p-2 h-100">
                <small className="text-muted d-block">
                  Warehouse Name
                </small>

                <span className="fw-semibold">
                  {warehouse.name}
                </span>
              </div>
            </div>

            {/* LOCATION */}
            <div className="col-md-3">
              <div className="border rounded p-2 h-100">
                <small className="text-muted d-block">
                  Location
                </small>

                <span className="fw-semibold">
                  {warehouse.location || "-"}
                </span>
              </div>
            </div>

            {/* ADDRESS */}
            {warehouse.address && (
              <div className="col-12">
                <div className="border rounded p-2">
                  <small className="text-muted d-block">
                    Address
                  </small>

                  <span className="fw-semibold">
                    {warehouse.address}
                  </span>
                </div>
              </div>
            )}

            {/* CREATED */}
            {warehouse.createdAt && (
              <div className="col-md-6">
                <div className="border rounded p-2">
                  <small className="text-muted d-block">
                    Created At
                  </small>

                  <span className="fw-semibold">
                    {warehouse.createdAt}
                  </span>
                </div>
              </div>
            )}

            {/* UPDATED */}
            {warehouse.updatedAt && (
              <div className="col-md-6">
                <div className="border rounded p-2">
                  <small className="text-muted d-block">
                    Updated At
                  </small>

                  <span className="fw-semibold">
                    {warehouse.updatedAt}
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* FOOTER */}
        <div className="card-footer bg-white d-flex justify-content-end gap-2 py-2">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/warehouses")}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate(`/warehouses/${id}/edit`)
            }
          >
            <i className="bi bi-pencil me-1"></i>
            Edit Warehouse
          </button>

        </div>

      </div>

    </div>
  );
}

export default WarehouseDetails;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getWarehouseById,
  updateWarehouse,
} from "../services/warehouseService";

function EditWarehouse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  code: "",
  name: "",
  location: "",
  active: true,
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWarehouse = async () => {
      try {
        const warehouse = await getWarehouseById(id);

        setFormData({
          code: warehouse.code || "",
          name: warehouse.name || "",
          location: warehouse.location || "",
          active: warehouse.active ?? true,
        });
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
      await updateWarehouse(id, formData);

      navigate(`/warehouses/${id}`);
    } catch (error) {
      console.error("Failed to update warehouse:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update warehouse."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
  className="container-fluid py-5 min-vh-100"
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
              Edit Warehouse
            </h3>

            <small className="text-muted">
              Update warehouse information
            </small>
          </div>

        </div>

        <div className="d-flex gap-2">

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/warehouses")}
            disabled={saving}
          >
            <i className="bi bi-building me-1"></i>
            Warehouses
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(`/warehouses/${id}`)}
            disabled={saving}
          >
            <i className="bi bi-eye me-1"></i>
            Details
          </button>

        </div>

      </div>

      {/* FORM CARD */}
      <div className="card bg-white border rounded-3 shadow-sm">

        <div className="card-header bg-white py-3">

          <div className="d-flex align-items-center gap-3">

            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-pencil-square fs-4"></i>
            </div>

            <div>
              <h5 className="fw-bold mb-0">
                Warehouse Information
              </h5>

              <small className="text-muted">
                Update the details for this warehouse
              </small>
            </div>

          </div>

        </div>

        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            <div className="row g-2">

              {/* CODE */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  Warehouse Code
                </label>

                <input
                  type="text"
                  name="code"
                  className="form-control"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* NAME */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  Warehouse Name
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

              {/* LOCATION */}
              <div className="col-md-6">

                <label className="form-label fw-semibold mb-1">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                />

              </div>

              {/* ACTIVE STATUS */}
              <div className="col-12">

                <div className="form-check mt-1">

                  <input
                    type="checkbox"
                    name="active"
                    className="form-check-input"
                    id="editActiveWarehouse"
                    checked={formData.active}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="editActiveWarehouse"
                  >
                    Active Warehouse
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
                onClick={() => navigate(`/warehouses/${id}`)}
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
                    Update Warehouse
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

export default EditWarehouse;
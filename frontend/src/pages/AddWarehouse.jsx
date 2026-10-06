import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWarehouse } from "../services/warehouseService";

function AddWarehouse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      const createdWarehouse = await createWarehouse(formData);

      navigate(`/warehouses/${createdWarehouse.id}`);
    } catch (error) {
      console.error("Failed to create warehouse:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create warehouse."
      );
    } finally {
      setSaving(false);
    }
  };

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
              Add Warehouse
            </h3>

            <small className="text-muted">
              Create a new warehouse
            </small>
          </div>

        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/warehouses")}
          disabled={saving}
        >
          <i className="bi bi-building me-1"></i>
          Warehouses
        </button>

      </div>

      {/* FORM CARD */}
      <div className="card bg-white border rounded-3 shadow-sm">

        <div className="card-header bg-white border-bottom py-3">

          <div className="d-flex align-items-center gap-3">

            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-building-add fs-4"></i>
            </div>

            <div>
              <h5 className="fw-bold mb-0">
                Warehouse Information
              </h5>

              <small className="text-muted">
                Enter the warehouse details
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
                  placeholder="Example: WH-001"
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
                  placeholder="Example: Main Warehouse"
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
                  placeholder="Example: Chennai"
                />

              </div>

              {/* ACTIVE STATUS */}
              <div className="col-md-6 d-flex align-items-end">

                <div className="form-check mb-2">

                  <input
                    type="checkbox"
                    name="active"
                    className="form-check-input"
                    id="activeWarehouse"
                    checked={formData.active}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="activeWarehouse"
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
                onClick={() => navigate("/warehouses")}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    Create Warehouse
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

export default AddWarehouse;
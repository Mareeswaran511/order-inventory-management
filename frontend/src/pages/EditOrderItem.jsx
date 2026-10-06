import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrderItemById,
  updateOrderItem,
} from "../services/orderItemService";

function EditOrderItem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    warehouseId: "",
    quantity: "",
    unitPrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadOrderItem = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderItemById(id);

        setFormData({
          orderId: data.orderId,
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
        });
      } catch (err) {
        console.error(
          "Failed to load order item:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load order item."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrderItem();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const requestData = {
        orderId: Number(formData.orderId),
        productId: Number(formData.productId),
        warehouseId: Number(formData.warehouseId),
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
      };

      await updateOrderItem(id, requestData);

      setSuccess(
        "Order item updated successfully."
      );

      setTimeout(() => {
        navigate(
          `/orders/${formData.orderId}`
        );
      }, 800);
    } catch (err) {
      console.error(
        "Failed to update order item:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update order item."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="container-fluid py-5 min-vh-100 text-center"
        style={{ backgroundColor: "#eef2f7" }}
      >
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body py-5">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mb-0">
              Loading order item...
            </p>
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
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-3"
          onClick={() =>
            navigate(
              `/orders/${formData.orderId}`
            )
          }
          disabled={saving}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Order
        </button>

        <h3 className="fw-bold mb-1">
          Edit Order Item
        </h3>

        <p className="text-muted mb-0">
          Update order item quantity and unit price.
        </p>
      </div>

      {/* =========================
          ALERTS
      ========================= */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-circle me-2"></i>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success d-flex align-items-center">
          <i className="bi bi-check-circle me-2"></i>
          <span>{success}</span>
        </div>
      )}

      {/* =========================
          FORM CARD
      ========================= */}
      <div className="card bg-white border rounded-3 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
              <i className="bi bi-pencil-square fs-5"></i>
            </div>

            <div>
              <h5 className="fw-bold mb-0">
                Order Item Information
              </h5>

              <small className="text-muted">
                Update quantity and pricing details
              </small>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* ORDER ID */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Order ID
                </label>

                <input
                  type="number"
                  className="form-control bg-light"
                  value={formData.orderId}
                  disabled
                />
              </div>

              {/* PRODUCT ID */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Product ID
                </label>

                <input
                  type="number"
                  className="form-control bg-light"
                  value={formData.productId}
                  disabled
                />
              </div>

              {/* WAREHOUSE ID */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Warehouse ID
                </label>

                <input
                  type="number"
                  className="form-control bg-light"
                  value={formData.warehouseId}
                  disabled
                />
              </div>

              {/* QUANTITY */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              {/* UNIT PRICE */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Unit Price
                </label>

                <div className="input-group">
                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="unitPrice"
                    className="form-control"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    disabled={saving}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  navigate(
                    `/orders/${formData.orderId}`
                  )
                }
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
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    Update Order Item
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

export default EditOrderItem;
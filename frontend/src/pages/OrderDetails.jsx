import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrderById,
  getOrderTotal,
  deleteOrder,
} from "../services/orderService";

import {
  getOrderItemsByOrderId,
  deleteOrderItem,
} from "../services/orderItemService";

import ToastMessage from "../components/ToastMessage";
import CommonTable from "../components/CommonTable";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingOrder, setDeletingOrder] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // =========================
  // LOAD ORDER DETAILS
  // =========================
  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [orderData, itemsData, totalData] =
        await Promise.all([
          getOrderById(id),
          getOrderItemsByOrderId(id),
          getOrderTotal(id),
        ]);

      setOrder(orderData);
      setItems(itemsData);
      setTotal(totalData);
    } catch (err) {
      console.error(
        "Failed to load order details:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TOAST
  // =========================
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast({
      show: false,
      message: "",
      type: "success",
    });
  };

  // =========================
  // DELETE ORDER ITEM
  // =========================
  const handleDeleteOrderItem = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteOrderItem(itemId);

      await loadOrderDetails();
    } catch (err) {
      console.error(
        "Failed to delete order item:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete order item."
      );
    }
  };

  // =========================
  // DELETE ORDER MODAL
  // =========================
  const openDeleteOrderModal = () => {
    setError("");
    setShowDeleteModal(true);
  };

  const closeDeleteOrderModal = () => {
    if (deletingOrder) {
      return;
    }

    setShowDeleteModal(false);
  };

  // =========================
  // DELETE ORDER
  // =========================
  const handleDeleteOrder = async () => {
    if (!order || deletingOrder) {
      return;
    }

    try {
      setDeletingOrder(true);
      setError("");

      await deleteOrder(order.id);

      setShowDeleteModal(false);

      showToast("Order deleted successfully.");

      setTimeout(() => {
        navigate("/orders");
      }, 800);
    } catch (err) {
      console.error(
        "Failed to delete order:",
        err
      );

      setDeletingOrder(false);
      setShowDeleteModal(false);

      setError(
        err.response?.data?.message ||
          "Failed to delete order."
      );
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  // =========================
  // STATUS BADGE
  // =========================
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning text-dark";

      case "PROCESSING":
        return "bg-info text-dark";

      case "SHIPPED":
        return "bg-primary";

      case "DELIVERED":
        return "bg-success";

      case "CANCELLED":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  // =========================
  // ITEM MODIFICATION RULES
  // =========================
  const canModifyItems =
    order?.status === "PENDING" ||
    order?.status === "PROCESSING";

  const canEditOrder =
    order?.status === "PENDING" ||
    order?.status === "PROCESSING" ||
    order?.status === "SHIPPED";

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="container-fluid p-3"
        style={{
          backgroundColor: "#eef2f7",
          minHeight: "100vh",
        }}
      >
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body text-center py-4">
            <div
              className="spinner-border spinner-border-sm text-primary mb-2"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted small mb-0">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR / ORDER NOT FOUND
  // =========================
  if (error && !order) {
    return (
      <div
        className="container-fluid p-3"
        style={{
          backgroundColor: "#eef2f7",
          minHeight: "100vh",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-2"
          onClick={() => navigate("/orders")}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Orders
        </button>

        <div className="alert alert-danger py-2 small mb-0">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="container-fluid p-3"
        style={{
          backgroundColor: "#eef2f7",
          minHeight: "100vh",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-2"
          onClick={() => navigate("/orders")}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Orders
        </button>

        <div className="alert alert-warning py-2 small mb-0">
          Order not found.
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3"
      style={{
        backgroundColor: "#eef2f7",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          TOAST
      ========================= */}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
      />

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm py-1 px-2 mb-2"
            onClick={() => navigate("/orders")}
            disabled={deletingOrder}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Orders
          </button>

          <h4 className="fw-bold mb-1">
            Order Details
          </h4>

          <p className="text-muted small mb-0">
            View order information and items.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {canEditOrder ? (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate(`/orders/${id}/edit`)
              }
              disabled={deletingOrder}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit Order
            </button>
          ) : (
            <span
              className="badge bg-secondary-subtle text-secondary d-flex align-items-center px-2"
              title={`Order cannot be edited when status is ${order.status}`}
            >
              <i className="bi bi-lock-fill me-1"></i>
              Order Locked
            </span>
          )}

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={openDeleteOrderModal}
            disabled={deletingOrder}
          >
            <i className="bi bi-trash me-1"></i>
            Delete Order
          </button>
        </div>
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-start py-2 px-3 small mb-3"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>

          <div>
            <div className="fw-semibold">
              Unable to process request
            </div>

            <div>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          ORDER INFORMATION
      ========================= */}
      <div className="card bg-white border rounded-3 shadow-sm mb-3">
        <div className="card-header bg-white border-bottom py-2 px-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
              style={{
                width: 34,
                height: 34,
              }}
            >
              <i className="bi bi-receipt"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-0">
                Order Information
              </h6>

              <small className="text-muted">
                Order summary and status
              </small>
            </div>
          </div>
        </div>

        <div className="card-body p-3">
          <div className="row g-2">
            {/* ORDER ID */}
            <div className="col-6 col-xl-3">
              <div className="border rounded-2 p-2 h-100">
                <small className="text-muted d-block mb-1">
                  Order ID
                </small>

                <div className="fw-semibold small">
                  #{order.id}
                </div>
              </div>
            </div>

            {/* ORDER NUMBER */}
            <div className="col-6 col-xl-3">
              <div className="border rounded-2 p-2 h-100">
                <small className="text-muted d-block mb-1">
                  Order Number
                </small>

                <div className="fw-semibold small text-break">
                  {order.orderNumber}
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="col-6 col-xl-3">
              <div className="border rounded-2 p-2 h-100">
                <small className="text-muted d-block mb-1">
                  Status
                </small>

                <span
                  className={`badge ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* CREATED */}
            <div className="col-6 col-xl-3">
              <div className="border rounded-2 p-2 h-100">
                <small className="text-muted d-block mb-1">
                  Created
                </small>

                <div className="fw-semibold small">
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ORDER ITEMS
      ========================= */}
      <div className="card bg-white border rounded-3 shadow-sm">
        <div className="card-header bg-white border-bottom py-2 px-3">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
                style={{
                  width: 34,
                  height: 34,
                }}
              >
                <i className="bi bi-box-seam"></i>
              </div>

              <div>
                <h6 className="fw-bold mb-0">
                  Order Items
                </h6>

                <small className="text-muted">
                  Products included in this order
                </small>
              </div>
            </div>

            <span className="badge bg-secondary">
              {items.length}{" "}
              {items.length === 1
                ? "Item"
                : "Items"}
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {items.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-box-seam fs-3 text-muted"></i>

              <h6 className="mt-2 mb-1">
                No Items Found
              </h6>

              <p className="text-muted small mb-0">
                This order does not contain any items.
              </p>
            </div>
          ) : (
            <CommonTable
              headers={[
                "ID",
                "Product ID",
                "Warehouse ID",
                "Quantity",
                "Unit Price",
                "Total",
                "Actions",
              ]}
            >
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold px-3">
                    #{item.id}
                  </td>

                  <td>
                    {item.productId}
                  </td>

                  <td>
                    {item.warehouseId}
                  </td>

                  <td>
                    <span className="badge bg-primary-subtle text-primary">
                      {item.quantity}
                    </span>
                  </td>

                  <td className="text-nowrap small">
                    ₹
                    {Number(
                      item.unitPrice
                    ).toFixed(2)}
                  </td>

                  <td className="fw-semibold text-nowrap small">
                    ₹
                    {Number(
                      item.totalPrice
                    ).toFixed(2)}
                  </td>

                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-1">
                      {canModifyItems ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary py-1 px-2"
                            onClick={() =>
                              navigate(
                                `/order-items/${item.id}/edit`
                              )
                            }
                            title="Edit Order Item"
                            aria-label="Edit Order Item"
                            disabled={deletingOrder}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger py-1 px-2"
                            onClick={() =>
                              handleDeleteOrderItem(
                                item.id
                              )
                            }
                            title="Delete Order Item"
                            aria-label="Delete Order Item"
                            disabled={deletingOrder}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      ) : (
                        <span
                          className="badge bg-secondary-subtle text-secondary"
                          title={`Order items are locked when order status is ${order.status}`}
                        >
                          <i className="bi bi-lock-fill me-1"></i>
                          Locked
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </CommonTable>
          )}
        </div>

        {/* =========================
            ORDER TOTAL
        ========================= */}
        <div className="card-footer bg-white border-top py-2 px-3">
          <div className="d-flex justify-content-end align-items-center gap-3">
            <span className="fw-semibold small">
              Order Total:
            </span>

            <span className="fs-5 fw-bold text-primary">
              ₹{Number(total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          DELETE ORDER CONFIRMATION MODAL
      ========================= */}
      {showDeleteModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content border-0 shadow">
                {/* MODAL HEADER */}
                <div className="modal-header py-2 px-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-danger bg-opacity-10 text-danger rounded d-flex align-items-center justify-content-center"
                      style={{
                        width: 34,
                        height: 34,
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </div>

                    <div>
                      <h6 className="modal-title fw-bold mb-0">
                        Delete Order
                      </h6>

                      <small className="text-muted">
                        This action cannot be undone.
                      </small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeDeleteOrderModal}
                    disabled={deletingOrder}
                  ></button>
                </div>

                {/* MODAL BODY */}
                <div className="modal-body p-3">
                  <p className="small mb-2">
                    Are you sure you want to delete
                    this order?
                  </p>

                  <div className="bg-light border rounded-2 p-2">
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                      <span className="text-muted small">
                        Order Number
                      </span>

                      <span className="fw-semibold small text-break text-end">
                        {order.orderNumber}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">
                        Status
                      </span>

                      <span
                        className={`badge ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="alert alert-warning py-2 px-2 mt-2 mb-0">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-exclamation-triangle-fill mt-1"></i>

                      <div>
                        <div className="fw-semibold small">
                          Inventory impact
                        </div>

                        <small>
                          Deleting this order removes its
                          items and restores their
                          quantities to inventory.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="modal-footer py-2 px-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={closeDeleteOrderModal}
                    disabled={deletingOrder}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleDeleteOrder}
                    disabled={deletingOrder}
                  >
                    {deletingOrder ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-1"></i>
                        Delete Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop fade show"
            onClick={closeDeleteOrderModal}
          ></div>
        </>
      )}
    </div>
  );
}

export default OrderDetails;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOrders,
  deleteOrder,
} from "../services/orderService";

import CommonTable from "../components/CommonTable";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD ORDERS
  // =========================
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================
  // DELETE ORDER
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteOrder(id);

      await loadOrders();
    } catch (err) {
      console.error("Failed to delete order:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete order."
      );
    }
  };

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
  // CHECK ORDER EDITABILITY
  // =========================
  const canEditOrder = (status) => {
    return (
      status === "PENDING" ||
      status === "PROCESSING" ||
      status === "SHIPPED"
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="container-fluid py-5 min-vh-100"
        style={{ backgroundColor: "#eef2f7" }}
      >
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
              Loading orders...
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
            Orders
          </h3>

          <p className="text-muted mb-0">
            Manage customer orders and order status.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/orders/create")}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Create Order
        </button>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-start mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>

          <div>
            <div className="fw-semibold">
              Unable to process request
            </div>

            <div>{error}</div>
          </div>
        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}
      {orders.length === 0 ? (
        <div className="card bg-white border rounded-3 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3">
              <i className="bi bi-receipt fs-3"></i>
            </div>

            <h5 className="mt-3 mb-2">
              No Orders Found
            </h5>

            <p className="text-muted mb-3">
              Create your first order to get started.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/orders/create")
              }
            >
              <i className="bi bi-plus-lg me-2"></i>
              Create Order
            </button>
          </div>
        </div>
      ) : (
        /* =========================
           ORDER CARD
        ========================= */
        <div className="card bg-white border rounded-3 shadow-sm">
          {/* CARD HEADER */}
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
                  <i className="bi bi-receipt fs-5"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">
                    Order List
                  </h5>

                  <small className="text-muted">
                    View and manage customer orders
                  </small>
                </div>
              </div>

              <span className="badge bg-secondary">
                {orders.length}{" "}
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </span>
            </div>
          </div>

          {/* =========================
              COMMON TABLE
          ========================= */}
          <CommonTable
            headers={[
              "ID",
              "Order Number",
              "Status",
              "Created",
              "Updated",
              "Actions",
            ]}
          >
            {orders.map((order) => {
              const editable = canEditOrder(
                order.status
              );

              return (
                <tr key={order.id}>
                  {/* ID */}
                  <td>
                    <span className="text-muted">
                      #{order.id}
                    </span>
                  </td>

                  {/* ORDER NUMBER */}
                  <td>
                    <span
                      className="fw-semibold text-nowrap"
                      title={order.orderNumber}
                    >
                      {order.orderNumber}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* CREATED */}
                  <td>
                    <span className="text-muted small text-nowrap">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString()
                        : "-"}
                    </span>
                  </td>

                  {/* UPDATED */}
                  <td>
                    <span className="text-muted small text-nowrap">
                      {order.updatedAt
                        ? new Date(
                            order.updatedAt
                          ).toLocaleString()
                        : "-"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {/* VIEW */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(
                            `/orders/${order.id}`
                          )
                        }
                        title="View Order"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      {/* EDIT / LOCKED */}
                      {editable ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            navigate(
                              `/orders/${order.id}/edit`
                            )
                          }
                          title="Edit Order"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      ) : (
                        <span
                          className="badge bg-secondary-subtle text-secondary px-2 py-2"
                          title={`Order is locked when status is ${order.status}`}
                        >
                          <i className="bi bi-lock-fill me-1"></i>
                          Locked
                        </span>
                      )}

                      {/* DELETE */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDelete(order.id)
                        }
                        title="Delete Order"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </CommonTable>

          {/* =========================
              CARD FOOTER
          ========================= */}
          <div className="card-footer bg-white border-top py-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <small className="text-muted">
                Showing {orders.length}{" "}
                {orders.length === 1
                  ? "order"
                  : "orders"}
              </small>

              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Orders can be updated until delivery.
                Items are locked after shipment.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
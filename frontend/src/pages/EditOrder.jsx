import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrderById,
  updateOrder,
} from "../services/orderService";

import {
  getOrderItemsByOrderId,
  createOrderItem,
} from "../services/orderItemService";

import { getProducts } from "../services/productService";
import { getWarehouses } from "../services/warehouseService";

import CommonTable from "../components/CommonTable";
import ToastMessage from "../components/ToastMessage";
import MessageModal from "../components/MessageModal";

// =====================================================
// ERROR MESSAGE HELPER
// =====================================================
const getErrorMessage = (err, fallbackMessage) => {
  const responseData = err?.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  if (err?.message) {
    return err.message;
  }

  return fallbackMessage;
};

// =====================================================
// EDIT ORDER
// =====================================================
function EditOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =====================================================
  // ORDER STATE
  // =====================================================
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("PENDING");

  // =====================================================
  // ORDER ITEM STATE
  // =====================================================
  const [orderItems, setOrderItems] = useState([]);
  const [newItems, setNewItems] = useState([]);

  // =====================================================
  // MASTER DATA
  // =====================================================
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // =====================================================
  // VALIDATION STATE
  // =====================================================
  const [hasValidItems, setHasValidItems] = useState(false);

  // =====================================================
  // PAGE STATE
  // =====================================================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // TOAST STATE
  // =====================================================
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // =====================================================
  // MESSAGE MODAL STATE
  // =====================================================
  const [messageModal, setMessageModal] = useState({
    show: false,
    title: "Unable to update order",
    message: "",
    type: "danger",
  });

  // =====================================================
  // SHOW TOAST
  // =====================================================
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  // =====================================================
  // CLOSE TOAST
  // =====================================================
  const closeToast = () => {
    setToast({
      show: false,
      message: "",
      type: "success",
    });
  };

  // =====================================================
  // SHOW MESSAGE MODAL
  // =====================================================
  const showMessageModal = (
    message,
    title = "Unable to update order",
    type = "danger"
  ) => {
    setMessageModal({
      show: true,
      title,
      message,
      type,
    });
  };

  // =====================================================
  // CLOSE MESSAGE MODAL
  // =====================================================
  const closeMessageModal = () => {
    setMessageModal({
      show: false,
      title: "Unable to update order",
      message: "",
      type: "danger",
    });
  };

  // =====================================================
  // ORDER STATUS CONTROL
  // =====================================================
  const canAddSku =
    status === "PENDING" ||
    status === "PROCESSING";

  const isLocked =
    status === "SHIPPED" ||
    status === "DELIVERED" ||
    status === "CANCELLED";

  // =====================================================
  // LOAD ORDER
  // =====================================================
  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        orderData,
        orderItemsData,
        productData,
        warehouseData,
      ] = await Promise.all([
        getOrderById(id),
        getOrderItemsByOrderId(id),
        getProducts(),
        getWarehouses(),
      ]);

      setOrderNumber(orderData.orderNumber || "");
      setStatus(orderData.status || "PENDING");

      const existingItems = Array.isArray(orderItemsData)
        ? orderItemsData
        : [];

      setOrderItems(existingItems);

      const validItemExists = existingItems.some(
        (item) =>
          item.quantity !== null &&
          item.quantity !== undefined &&
          !Number.isNaN(Number(item.quantity)) &&
          Number(item.quantity) >= 1
      );

      setHasValidItems(validItemExists);

      setProducts(
        productData?.content || productData || []
      );

      setWarehouses(
        warehouseData?.content || warehouseData || []
      );
    } catch (err) {
      console.error("Failed to load order:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to load the order. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    loadOrder();
  }, [id]);

  // =====================================================
  // ADD NEW SKU ROW
  // =====================================================
  const addNewItem = () => {
    if (!canAddSku) {
      return;
    }

    setError("");

    setNewItems((previousItems) => [
      ...previousItems,
      {
        productId: "",
        warehouseId: "",
        quantity: "",
        unitPrice: "",
      },
    ]);
  };

  // =====================================================
  // REMOVE NEW SKU ROW
  // =====================================================
  const removeNewItem = (index) => {
    setError("");

    setNewItems((previousItems) =>
      previousItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  // =====================================================
  // CHANGE NEW SKU FIELD
  // =====================================================
  const handleNewItemChange = (
    index,
    field,
    value
  ) => {
    setError("");

    setNewItems((previousItems) =>
      previousItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // =====================================================
  // GET PRODUCT DETAILS
  // =====================================================
  const getSelectedProduct = (productId) => {
    return products.find(
      (product) =>
        Number(product.id) === Number(productId)
    );
  };

  // =====================================================
  // GET WAREHOUSE DETAILS
  // =====================================================
  const getSelectedWarehouse = (warehouseId) => {
    return warehouses.find(
      (warehouse) =>
        Number(warehouse.id) === Number(warehouseId)
    );
  };

  // =====================================================
  // VALIDATE NEW ITEMS
  // =====================================================
  const validateNewItems = () => {
    // -------------------------------------------------
    // BASIC FIELD VALIDATION
    // -------------------------------------------------
    for (let index = 0; index < newItems.length; index++) {
      const item = newItems[index];

      if (!item.productId) {
        return `Please select a product for item ${
          index + 1
        }.`;
      }

      if (!item.warehouseId) {
        return `Please select a warehouse for item ${
          index + 1
        }.`;
      }

      if (
        item.quantity === "" ||
        item.quantity === null ||
        Number.isNaN(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return `Quantity for item ${
          index + 1
        } must be at least 1.`;
      }

      if (
        item.unitPrice === "" ||
        item.unitPrice === null ||
        Number.isNaN(Number(item.unitPrice)) ||
        Number(item.unitPrice) < 0
      ) {
        return `Unit price for item ${
          index + 1
        } must be 0 or greater.`;
      }
    }

    // -------------------------------------------------
    // DUPLICATE VALIDATION AGAINST EXISTING ITEMS
    // -------------------------------------------------
    for (
      let newIndex = 0;
      newIndex < newItems.length;
      newIndex++
    ) {
      const newItem = newItems[newIndex];

      const duplicateExistingItem = orderItems.find(
        (existingItem) =>
          Number(existingItem.productId) ===
            Number(newItem.productId) &&
          Number(existingItem.warehouseId) ===
            Number(newItem.warehouseId)
      );

      if (duplicateExistingItem) {
        const product = getSelectedProduct(
          newItem.productId
        );

        const productName = product
          ? `${product.name} (${product.sku})`
          : `Product ID ${newItem.productId}`;

        const warehouse =
          getSelectedWarehouse(
            newItem.warehouseId
          );

        const warehouseName = warehouse
          ? `${warehouse.name} (${warehouse.code})`
          : `Warehouse ID ${newItem.warehouseId}`;

        return `${productName} is already added to this order for ${warehouseName}. Please update the existing item instead.`;
      }
    }

    // -------------------------------------------------
    // DUPLICATE VALIDATION AMONG NEW ITEMS
    // -------------------------------------------------
    for (let i = 0; i < newItems.length; i++) {
      for (let j = i + 1; j < newItems.length; j++) {
        const currentItem = newItems[i];
        const nextItem = newItems[j];

        const sameProduct =
          Number(currentItem.productId) ===
          Number(nextItem.productId);

        const sameWarehouse =
          Number(currentItem.warehouseId) ===
          Number(nextItem.warehouseId);

        if (sameProduct && sameWarehouse) {
          const product = getSelectedProduct(
            currentItem.productId
          );

          const productName = product
            ? `${product.name} (${product.sku})`
            : `Product ID ${currentItem.productId}`;

          return `${productName} is already added in the new SKU list for the selected warehouse. Please update the existing row instead.`;
        }
      }
    }

    return "";
  };

  // =====================================================
  // SUBMIT / UPDATE ORDER
  // =====================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // -------------------------------------------------
    // VALIDATE ORDER NUMBER
    // -------------------------------------------------
    if (!orderNumber.trim()) {
      showMessageModal(
        "Order number is required.",
        "Invalid Order Details",
        "warning"
      );
      return;
    }

    // -------------------------------------------------
    // VALIDATE STATUS / ITEM REQUIREMENT
    // -------------------------------------------------
    if (
      status !== "PENDING" &&
      status !== "PROCESSING" &&
      !hasValidItems
    ) {
      showMessageModal(
        "Add at least one order item with quantity 1 or more before changing the order status.",
        "Order Item Required",
        "warning"
      );
      return;
    }

    // -------------------------------------------------
    // VALIDATE NEW SKU ROWS
    // -------------------------------------------------
    const newItemValidationError =
      validateNewItems();

    if (newItemValidationError) {
      showMessageModal(
        newItemValidationError,
        "Invalid Order Item",
        "warning"
      );
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // 1. CREATE NEW ORDER ITEMS
      // =================================================
      for (
        let index = 0;
        index < newItems.length;
        index++
      ) {
        const item = newItems[index];

        try {
          await createOrderItem({
            orderId: Number(id),
            productId: Number(item.productId),
            warehouseId: Number(item.warehouseId),
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          });
        } catch (err) {
          console.error(
            `Failed to create order item ${index + 1}:`,
            err
          );

          const message = getErrorMessage(
            err,
            `Unable to add item ${index + 1}.`
          );

          showMessageModal(
            message,
            "Unable to add order item",
            "danger"
          );

          return;
        }
      }

      // =================================================
      // 2. UPDATE ORDER
      // =================================================
      try {
        await updateOrder(id, {
          orderNumber: orderNumber.trim(),
          status,
        });
      } catch (err) {
        console.error(
          "Failed to update order:",
          err
        );

        const message = getErrorMessage(
          err,
          "Unable to update the order."
        );

        showMessageModal(
          message,
          "Unable to update order",
          "danger"
        );

        return;
      }

      // =================================================
      // 3. SUCCESS
      // =================================================
      showToast(
        "Order updated successfully.",
        "success"
      );

      // =================================================
      // 4. NAVIGATE AFTER SUCCESS
      // =================================================
      setTimeout(() => {
        navigate(`/orders/${id}`);
      }, 800);
    } catch (err) {
      console.error(
        "Unexpected error while updating order:",
        err
      );

      const message = getErrorMessage(
        err,
        "Something went wrong while updating the order."
      );

      showMessageModal(
        message,
        "Something Went Wrong",
        "danger"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PRODUCT DISPLAY
  // =====================================================
  const getProductDisplay = (productId) => {
    const product = getSelectedProduct(productId);

    if (!product) {
      return `Product #${productId}`;
    }

    return `${product.sku} - ${product.name}`;
  };

  // =====================================================
  // WAREHOUSE DISPLAY
  // =====================================================
  const getWarehouseDisplay = (warehouseId) => {
    const warehouse =
      getSelectedWarehouse(warehouseId);

    if (!warehouse) {
      return `Warehouse #${warehouseId}`;
    }

    return `${warehouse.code} - ${warehouse.name}`;
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div
        className="container-fluid px-3 py-3 min-vh-100"
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
              Loading order...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <div
      className="container-fluid px-3 py-2 min-vh-100"
      style={{
        backgroundColor: "#eef2f7",
      }}
    >
      {/* =================================================
          TOAST
      ================================================= */}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
      />

      {/* =================================================
          MESSAGE MODAL
      ================================================= */}
      <MessageModal
        show={messageModal.show}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        onClose={closeMessageModal}
      />

      {/* =================================================
          COMPACT PAGE HEADER
      ================================================= */}
      <div className="mb-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm py-1 px-2 mb-1"
          onClick={() =>
            navigate(`/orders/${id}`)
          }
          disabled={saving}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Order
        </button>

        <div>
          <h4 className="fw-bold mb-0">
            Order Editing
          </h4>

          <div className="text-muted small mt-1">
            Update order details and manage order items
          </div>
        </div>
      </div>

      {/* =================================================
          LOAD ERROR
      ================================================= */}
      {error && (
        <div
          className="alert alert-danger py-2 px-3 mb-2 d-flex align-items-start"
          role="alert"
        >
          <i className="bi bi-exclamation-circle me-2 mt-1"></i>

          <div>
            <div className="fw-semibold">
              Unable to load order
            </div>

            <div className="small">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          STATUS INFORMATION
      ================================================= */}
      {canAddSku && (
        <div
          className="alert alert-light border py-2 px-3 mb-2 d-flex align-items-start"
          role="alert"
        >
          <i className="bi bi-pencil-square me-2 mt-1 text-primary"></i>

          <div className="small">
            <span className="fw-semibold">
              Order is editable.
            </span>{" "}
            You can add new SKUs while the order is in{" "}
            <strong>{status}</strong> status.
          </div>
        </div>
      )}

      {isLocked && (
        <div
          className="alert alert-warning py-2 px-3 mb-2 d-flex align-items-start"
          role="alert"
        >
          <i className="bi bi-lock-fill me-2 mt-1"></i>

          <div className="small">
            <span className="fw-semibold">
              Order is locked.
            </span>{" "}
            This order has been{" "}
            <strong>
              {status.toLowerCase()}
            </strong>
            . Order items can no longer be added,
            updated, or deleted.
          </div>
        </div>
      )}

      {/* =================================================
          ORDER INFORMATION
      ================================================= */}
      <div className="card bg-white border rounded-3 shadow-sm mb-2">
        <div className="card-header bg-white border-bottom py-2 px-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded p-2"
              style={{
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="bi bi-pencil-square"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-0">
                Order Information
              </h6>

              <small className="text-muted">
                Update the order details
              </small>
            </div>
          </div>
        </div>

        <div className="card-body py-2 px-3">
          <div className="row g-2">
            {/* ORDER NUMBER */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold mb-1">
                Order Number
              </label>

              <input
                type="text"
                className="form-control form-control-sm"
                value={orderNumber}
                onChange={(event) => {
                  setOrderNumber(event.target.value);
                  setError("");
                }}
                placeholder="Enter order number"
                disabled={saving || isLocked}
              />

              {isLocked && (
                <small className="text-muted">
                  <i className="bi bi-lock me-1"></i>
                  Order number cannot be changed after
                  shipment.
                </small>
              )}
            </div>

            {/* STATUS */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold mb-1">
                Status
              </label>

              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setError("");
                }}
                disabled={
                  saving || !hasValidItems
                }
              >
                <option value="PENDING">
                  PENDING
                </option>

                <option value="PROCESSING">
                  PROCESSING
                </option>

                <option value="SHIPPED">
                  SHIPPED
                </option>

                <option value="DELIVERED">
                  DELIVERED
                </option>

                <option value="CANCELLED">
                  CANCELLED
                </option>
              </select>

              {!hasValidItems && (
                <small className="text-danger">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  Add at least one valid item before
                  changing status.
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          EXISTING ORDER ITEMS
      ================================================= */}
      <div className="card bg-white border rounded-3 shadow-sm mb-2">
        <div className="card-header bg-white border-bottom py-2 px-3">
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div>
              <h6 className="fw-bold mb-0">
                Order Items
              </h6>

              <small className="text-muted">
                Existing SKUs in this order
              </small>
            </div>

            {canAddSku && (
              <button
                type="button"
                className="btn btn-primary btn-sm py-1 px-2"
                onClick={addNewItem}
                disabled={saving}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add SKU
              </button>
            )}
          </div>
        </div>

        <div className="card-body p-0">
          {orderItems.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-box-seam fs-3 d-block mb-2"></i>

              <div className="fw-semibold small">
                No order items found
              </div>

              {canAddSku && (
                <small>
                  Add a SKU to this order to continue.
                </small>
              )}
            </div>
          ) : (
            <CommonTable
              headers={[
                "Product / SKU",
                "Warehouse",
                "Quantity",
                "Unit Price",
                "Total Price",
              ]}
            >
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-semibold small">
                      {getProductDisplay(
                        item.productId
                      )}
                    </div>

                    <small className="text-muted">
                      Product ID: {item.productId}
                    </small>
                  </td>

                  <td className="small">
                    {getWarehouseDisplay(
                      item.warehouseId
                    )}
                  </td>

                  <td className="small">
                    {item.quantity}
                  </td>

                  <td className="small">
                    ₹
                    {Number(
                      item.unitPrice || 0
                    ).toFixed(2)}
                  </td>

                  <td className="fw-semibold small">
                    ₹
                    {Number(
                      item.totalPrice || 0
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </CommonTable>
          )}
        </div>
      </div>

      {/* =================================================
          NEW SKU ITEMS
      ================================================= */}
      {newItems.length > 0 && (
        <div className="card bg-white border rounded-3 shadow-sm mb-2">
          <div className="card-header bg-white border-bottom py-2 px-3">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div>
                <h6 className="fw-bold mb-0">
                  New SKU Items
                </h6>

                <small className="text-muted">
                  These items will be added when you
                  update the order.
                </small>
              </div>

              <span className="badge text-bg-primary">
                {newItems.length}{" "}
                {newItems.length === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>
          </div>

          <div className="card-body p-2">
            {newItems.map((item, index) => (
              <div
                className="border rounded-3 p-2 mb-2 bg-light"
                key={index}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold small">
                    New Item {index + 1}
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm py-1 px-2"
                    onClick={() =>
                      removeNewItem(index)
                    }
                    disabled={saving}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Remove
                  </button>
                </div>

                <div className="row g-2">
                  {/* PRODUCT */}
                  <div className="col-xl-4 col-lg-4 col-md-6">
                    <label className="form-label small fw-semibold mb-1">
                      Product / SKU
                    </label>

                    <select
                      className="form-select form-select-sm"
                      value={item.productId}
                      onChange={(event) =>
                        handleNewItemChange(
                          index,
                          "productId",
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option value="">
                        Select Product / SKU
                      </option>

                      {products.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                        >
                          {product.sku} -{" "}
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* WAREHOUSE */}
                  <div className="col-xl-4 col-lg-4 col-md-6">
                    <label className="form-label small fw-semibold mb-1">
                      Warehouse
                    </label>

                    <select
                      className="form-select form-select-sm"
                      value={item.warehouseId}
                      onChange={(event) =>
                        handleNewItemChange(
                          index,
                          "warehouseId",
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option value="">
                        Select Warehouse
                      </option>

                      {warehouses.map(
                        (warehouse) => (
                          <option
                            key={warehouse.id}
                            value={warehouse.id}
                          >
                            {warehouse.code} -{" "}
                            {warehouse.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* QUANTITY */}
                  <div className="col-xl-2 col-lg-2 col-md-3 col-6">
                    <label className="form-label small fw-semibold mb-1">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="form-control form-control-sm"
                      value={item.quantity}
                      onChange={(event) =>
                        handleNewItemChange(
                          index,
                          "quantity",
                          event.target.value
                        )
                      }
                      placeholder="Quantity"
                      disabled={saving}
                    />
                  </div>

                  {/* UNIT PRICE */}
                  <div className="col-xl-2 col-lg-2 col-md-3 col-6">
                    <label className="form-label small fw-semibold mb-1">
                      Unit Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control form-control-sm"
                      value={item.unitPrice}
                      onChange={(event) =>
                        handleNewItemChange(
                          index,
                          "unitPrice",
                          event.target.value
                        )
                      }
                      placeholder="Unit price"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm py-1 px-2"
              onClick={addNewItem}
              disabled={saving || !canAddSku}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Another SKU
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          ACTIONS
      ================================================= */}
      <div className="d-flex justify-content-end gap-2 mt-2 pb-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm px-3"
          onClick={() =>
            navigate(`/orders/${id}`)
          }
          disabled={saving}
        >
          <i className="bi bi-x-lg me-1"></i>
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm px-3"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              Updating...
            </>
          ) : (
            <>
              <i className="bi bi-check2-circle me-1"></i>
              Update Order
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default EditOrder;
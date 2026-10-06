import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../services/orderService";
import { createOrderItem } from "../services/orderItemService";

import { getProducts } from "../services/productService";
import { getWarehouses } from "../services/warehouseService";

import ProductSelectorModal from "../components/ProductSelectorModal";
import WarehouseSelectorModal from "../components/WarehouseSelectorModal";
import ToastMessage from "../components/ToastMessage";

function CreateOrder() {
  const navigate = useNavigate();

  // =========================
  // MASTER DATA
  // =========================

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // =========================
  // ORDER
  // =========================

  const [status, setStatus] = useState("PENDING");

  const [items, setItems] = useState([
    {
      productId: "",
      warehouseId: "",
      quantity: "",
      unitPrice: "",
    },
  ]);

  // =========================
  // UI STATE
  // =========================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // TOAST STATE
  // =========================

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // =========================
  // PRODUCT MODAL
  // =========================

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [activeProductItemIndex, setActiveProductItemIndex] =
    useState(null);

  // =========================
  // WAREHOUSE MODAL
  // =========================

  const [showWarehouseModal, setShowWarehouseModal] =
    useState(false);

  const [
    activeWarehouseItemIndex,
    setActiveWarehouseItemIndex,
  ] = useState(null);

  // =========================
  // LOAD MASTER DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productData, warehouseData] =
          await Promise.all([
            getProducts(),
            getWarehouses(),
          ]);

        setProducts(
          productData.content || productData
        );

        setWarehouses(
          warehouseData.content || warehouseData
        );
      } catch (err) {
        console.error(
          "Failed to load products/warehouses:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load products and warehouses."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =========================
  // ERROR MESSAGE HELPER
  // =========================

  const getErrorMessage = (
    err,
    fallbackMessage
  ) => {
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

  // =========================
  // TOAST HELPERS
  // =========================

  const showToast = (
    message,
    type = "success"
  ) => {
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
  // ITEM CHANGE
  // =========================

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setItems((previousItems) =>
      previousItems.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      )
    );

    if (error) {
      setError("");
    }
  };

  // =========================
  // ADD SKU
  // =========================

  const addItem = () => {
    setItems((previousItems) => [
      ...previousItems,
      {
        productId: "",
        warehouseId: "",
        quantity: "",
        unitPrice: "",
      },
    ]);

    setError("");
  };

  // =========================
  // REMOVE SKU
  // =========================

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((previousItems) =>
      previousItems.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );

    setError("");
  };

  // =========================
  // PRODUCT MODAL
  // =========================

  const openProductModal = (index) => {
    setActiveProductItemIndex(index);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setActiveProductItemIndex(null);
  };

  const handleProductSelect = (product) => {
    if (
      activeProductItemIndex === null
    ) {
      return;
    }

    handleItemChange(
      activeProductItemIndex,
      "productId",
      String(product.id)
    );

    closeProductModal();
  };

  // =========================
  // SELECTED PRODUCT
  // =========================

  const getSelectedProduct = (
    productId
  ) => {
    return products.find(
      (product) =>
        Number(product.id) ===
        Number(productId)
    );
  };

  // =========================
  // WAREHOUSE MODAL
  // =========================

  const openWarehouseModal = (index) => {
    setActiveWarehouseItemIndex(index);
    setShowWarehouseModal(true);
  };

  const closeWarehouseModal = () => {
    setShowWarehouseModal(false);
    setActiveWarehouseItemIndex(null);
  };

  const handleWarehouseSelect = (
    warehouse
  ) => {
    if (
      activeWarehouseItemIndex === null
    ) {
      return;
    }

    handleItemChange(
      activeWarehouseItemIndex,
      "warehouseId",
      String(warehouse.id)
    );

    closeWarehouseModal();
  };

  // =========================
  // SELECTED WAREHOUSE
  // =========================

  const getSelectedWarehouse = (
    warehouseId
  ) => {
    return warehouses.find(
      (warehouse) =>
        Number(warehouse.id) ===
        Number(warehouseId)
    );
  };

  // =========================
  // VALIDATE ORDER ITEMS
  // =========================

  const validateItems = () => {
    for (
      let i = 0;
      i < items.length;
      i++
    ) {
      const item = items[i];

      if (!item.productId) {
        return `Please select a product for item ${
          i + 1
        }.`;
      }

      if (!item.warehouseId) {
        return `Please select a warehouse for item ${
          i + 1
        }.`;
      }

      if (
        item.quantity === "" ||
        item.quantity === null ||
        Number.isNaN(
          Number(item.quantity)
        ) ||
        Number(item.quantity) < 1
      ) {
        return `Quantity must be at least 1 for item ${
          i + 1
        }.`;
      }

      if (
        item.unitPrice === "" ||
        item.unitPrice === null ||
        Number.isNaN(
          Number(item.unitPrice)
        ) ||
        Number(item.unitPrice) < 0
      ) {
        return `Unit price cannot be negative or empty for item ${
          i + 1
        }.`;
      }
    }

    // =========================
    // DUPLICATE VALIDATION
    // =========================

    for (
      let i = 0;
      i < items.length;
      i++
    ) {
      for (
        let j = i + 1;
        j < items.length;
        j++
      ) {
        const currentItem = items[i];
        const nextItem = items[j];

        const sameProduct =
          Number(
            currentItem.productId
          ) ===
          Number(nextItem.productId);

        const sameWarehouse =
          Number(
            currentItem.warehouseId
          ) ===
          Number(nextItem.warehouseId);

        if (
          sameProduct &&
          sameWarehouse
        ) {
          const product =
            getSelectedProduct(
              currentItem.productId
            );

          const productName = product
            ? `${product.name} (${product.sku})`
            : `Product ID ${currentItem.productId}`;

          return (
            `${productName} is already added ` +
            `for the selected warehouse. ` +
            `Please update the existing item instead.`
          );
        }
      }
    }

    return "";
  };

  // =========================
  // SUBMIT ORDER
  // =========================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!status) {
      const message =
        "Order status is required.";

      setError(message);
      showToast(message, "error");
      return;
    }

    const validationError =
      validateItems();

    if (validationError) {
      setError(validationError);

      showToast(
        validationError,
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      const createdOrder =
        await createOrder({
          status,
        });

      for (const item of items) {
        await createOrderItem({
          orderId: createdOrder.id,
          productId: Number(
            item.productId
          ),
          quantity: Number(
            item.quantity
          ),
          unitPrice: Number(
            item.unitPrice
          ),
          warehouseId: Number(
            item.warehouseId
          ),
        });
      }

      showToast(
        "Order created successfully."
      );

      setTimeout(() => {
        navigate(
          `/orders/${createdOrder.id}`
        );
      }, 800);
    } catch (err) {
      console.error(
        "Failed to create order:",
        err
      );

      const message =
        getErrorMessage(
          err,
          "Failed to create order. Please check the order details and stock."
        );

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor:
            "#eef2f7",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-2"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <div className="small text-muted">
            Loading order data...
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div
      className="container-fluid px-3 py-2"
      style={{
        backgroundColor:
          "#eef2f7",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* =========================
          TOAST
      ========================== */}

      <ToastMessage
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
      />

    {/* =========================
        COMPACT PAGE HEADER
    ========================== */}

    <div className="mb-2">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm py-1 px-2 mb-1"
        onClick={() =>
          navigate("/orders")
        }
        disabled={saving}
      >
        <i className="bi bi-arrow-left me-1"></i>
        Back to Orders
      </button>

      <div>
        <h4 className="fw-bold mb-0">
          Order Creation
        </h4>

        <div className="text-muted small mt-1">
          Create an order and add products
        </div>
      </div>
    </div>
      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div
          className="alert alert-danger py-2 px-3 mb-2 small d-flex align-items-start"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>

          <div>
            <span className="fw-semibold">
              Unable to create order:
            </span>{" "}
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* =========================
            ORDER INFORMATION
        ========================== */}

        <div className="card border rounded-3 shadow-sm mb-2">
          <div className="card-header bg-white border-bottom py-2 px-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
                style={{
                  width: "34px",
                  height: "34px",
                }}
              >
                <i className="bi bi-receipt"></i>
              </div>

              <div>
                <div className="fw-bold">
                  Order Information
                </div>

                <div className="text-muted small">
                  Configure the initial order status.
                </div>
              </div>
            </div>
          </div>

          <div className="card-body px-3 py-2">
            <div className="row g-2">
              {/* STATUS */}

              <div className="col-md-6">
                <label
                  htmlFor="status"
                  className="form-label fw-semibold small mb-1"
                >
                  Order Status
                </label>

                <select
                  id="status"
                  className="form-select form-select-sm"
                  value={status}
                  onChange={(event) => {
                    setStatus(
                      event.target.value
                    );
                    setError("");
                  }}
                  disabled={saving}
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
              </div>

              {/* ORDER NUMBER */}

              <div className="col-md-6">
                <label className="form-label fw-semibold small mb-1">
                  Order Number
                </label>

                <div className="form-control form-control-sm bg-light text-muted">
                  <i className="bi bi-magic me-1"></i>
                  Auto-generated after creation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            ORDER ITEMS
        ========================== */}

        <div className="card border rounded-3 shadow-sm mb-2">
          <div className="card-header bg-white border-bottom py-2 px-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
                  style={{
                    width: "34px",
                    height: "34px",
                  }}
                >
                  <i className="bi bi-box-seam"></i>
                </div>

                <div>
                  <div className="fw-bold">
                    Order Items
                  </div>

                  <div className="text-muted small">
                    Add one or more SKUs to this order.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm py-1 px-2"
                onClick={addItem}
                disabled={saving}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add SKU
              </button>
            </div>
          </div>

          <div className="card-body px-3 py-2">
            {items.map(
              (item, index) => {
                const selectedProduct =
                  getSelectedProduct(
                    item.productId
                  );

                const selectedWarehouse =
                  getSelectedWarehouse(
                    item.warehouseId
                  );

                return (
                  <div
                    key={index}
                    className="border rounded-3 p-2 mb-2 bg-light"
                  >
                    {/* ITEM HEADER */}

                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-semibold small">
                        Item {index + 1}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                          disabled={saving}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </button>
                      )}
                    </div>

                    {/* ITEM FIELDS */}

                    <div className="row g-2">
                      {/* PRODUCT */}

                      <div className="col-xl-4 col-lg-4 col-md-6">
                        <label className="form-label fw-semibold small mb-1">
                          Product
                        </label>

                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              selectedProduct
                                ? `${selectedProduct.name} (${selectedProduct.sku})`
                                : ""
                            }
                            placeholder="Select product"
                            readOnly
                          />

                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              openProductModal(
                                index
                              )
                            }
                            disabled={saving}
                          >
                            <i className="bi bi-search me-1"></i>
                            Select
                          </button>
                        </div>
                      </div>

                      {/* WAREHOUSE */}

                      <div className="col-xl-4 col-lg-4 col-md-6">
                        <label className="form-label fw-semibold small mb-1">
                          Warehouse
                        </label>

                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              selectedWarehouse
                                ? `${selectedWarehouse.name} (${selectedWarehouse.code})`
                                : ""
                            }
                            placeholder="Select warehouse"
                            readOnly
                          />

                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              openWarehouseModal(
                                index
                              )
                            }
                            disabled={saving}
                          >
                            <i className="bi bi-search me-1"></i>
                            Select
                          </button>
                        </div>
                      </div>

                      {/* QUANTITY */}

                      <div className="col-xl-2 col-lg-2 col-md-3 col-6">
                        <label
                          htmlFor={`quantity-${index}`}
                          className="form-label fw-semibold small mb-1"
                        >
                          Quantity
                        </label>

                        <input
                          id={`quantity-${index}`}
                          type="number"
                          className="form-control form-control-sm"
                          min="1"
                          step="1"
                          value={
                            item.quantity
                          }
                          onChange={(
                            event
                          ) =>
                            handleItemChange(
                              index,
                              "quantity",
                              event.target
                                .value
                            )
                          }
                          disabled={saving}
                          placeholder="Qty"
                        />
                      </div>

                      {/* UNIT PRICE */}

                      <div className="col-xl-2 col-lg-2 col-md-3 col-6">
                        <label
                          htmlFor={`unitPrice-${index}`}
                          className="form-label fw-semibold small mb-1"
                        >
                          Unit Price
                        </label>

                        <input
                          id={`unitPrice-${index}`}
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          step="0.01"
                          value={
                            item.unitPrice
                          }
                          onChange={(
                            event
                          ) =>
                            handleItemChange(
                              index,
                              "unitPrice",
                              event.target
                                .value
                            )
                          }
                          disabled={saving}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {/* ITEM SUMMARY */}

            <div className="d-flex justify-content-between align-items-center text-muted small">
              <span>
                <i className="bi bi-box-seam me-1"></i>
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}{" "}
                added
              </span>

              <span className="d-none d-md-inline">
                <i className="bi bi-info-circle me-1"></i>
                Product + Warehouse must be unique.
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            FORM ACTIONS
        ========================== */}

        <div className="d-flex justify-content-end gap-2 mt-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={() =>
              navigate("/orders")
            }
            disabled={saving}
          >
            <i className="bi bi-x-lg me-1"></i>
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-sm px-3"
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-1"></i>
                Create Order
              </>
            )}
          </button>
        </div>
      </form>

      {/* =========================
          PRODUCT SELECTOR MODAL
      ========================== */}

      <ProductSelectorModal
        show={showProductModal}
        products={products}
        onClose={closeProductModal}
        onSelect={handleProductSelect}
      />

      {/* =========================
          WAREHOUSE SELECTOR MODAL
      ========================== */}

      <WarehouseSelectorModal
        show={showWarehouseModal}
        warehouses={warehouses}
        onClose={closeWarehouseModal}
        onSelect={handleWarehouseSelect}
      />
    </div>
  );
}

export default CreateOrder;
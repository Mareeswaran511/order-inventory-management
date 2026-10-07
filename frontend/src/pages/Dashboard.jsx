import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* =========================
            SIDEBAR
        ========================= */}
        <aside
          className="col-lg-2 col-md-3 text-white d-flex flex-column"
          style={{
            backgroundColor: "#1f2937",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Logo */}
          <div className="px-4 py-3 border-bottom border-secondary">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#0d6efd",
                }}
              >
                <i className="bi bi-box-seam fs-4 text-white"></i>
              </div>

              <div>
                <h5 className="mb-0 fw-bold text-white">
                  WMS
                </h5>

                <small className="text-white-50">
                  Order & Inventory
                </small>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <nav
            className="px-3 py-2 flex-grow-1"
            style={{
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div className="text-uppercase text-white-50 small fw-semibold mb-2 px-2">
              Main Menu
            </div>

            {/* Dashboard */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white fw-semibold"
              style={{
                backgroundColor: "#0d6efd",
                borderRadius: "8px",
              }}
            >
              <i className="bi bi-speedometer2 me-3"></i>
              Dashboard
            </button>

            {/* Products */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white"
              style={{
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/products")}
            >
              <i className="bi bi-box-seam me-3"></i>
              Products
            </button>

            {/* Inventory */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white"
              style={{
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/inventory")}
            >
              <i className="bi bi-bar-chart-line me-3"></i>
              Inventory
            </button>

            {/* Orders */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white"
              style={{
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/orders")}
            >
              <i className="bi bi-cart3 me-3"></i>
              Orders
            </button>

            {/* Warehouses */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white"
              style={{
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/warehouses")}
            >
              <i className="bi bi-building me-3"></i>
              Warehouses
            </button>

            {/* Stock Movements */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white"
              style={{
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/stock-movements")}
            >
              <i className="bi bi-arrow-left-right me-3"></i>
              Stock Movements
            </button>
          </nav>

          {/* Bottom Menu */}
          <div
            className="px-3 py-2 border-top border-secondary"
            style={{ flexShrink: 0 }}
          >
            {/* Settings */}
            <button
              type="button"
              className="btn w-100 text-start mb-1 text-white"
              style={{
                backgroundColor: "transparent",
                borderRadius: "8px",
              }}
            >
              <i className="bi bi-gear me-3"></i>
              Settings
            </button>

            {/* Logout */}
            <button
              type="button"
              className="btn btn-outline-danger w-100 text-start"
              style={{
                borderRadius: "8px",
              }}
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-3"></i>
              Logout
            </button>
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <main
          className="col-lg-10 col-md-9"
          style={{
            backgroundColor: "#f3f6f9",
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Header */}
          <header className="bg-white border-bottom px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1 fw-bold">
                  Dashboard
                </h2>

                <p className="text-muted mb-0">
                  Overview of your order and inventory operations
                </p>
              </div>

              {/* User Profile */}
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                >
                  M
                </div>

                <div className="d-none d-sm-block">
                  <div className="fw-semibold">
                    Marees
                  </div>

                  <small className="text-muted">
                    Administrator
                  </small>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <section className="p-4">

            {/* Introduction */}
            <div className="mb-4">
              <h4 className="fw-bold mb-1">
                Overview
              </h4>

              <p className="text-muted mb-0">
                Manage your products, inventory, orders and warehouses
                from one place.
              </p>
            </div>

            {/* Module Cards */}
            <div className="row g-4">

              {/* Products */}
              <div className="col-xl-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 d-inline-flex mb-3">
                      <i className="bi bi-box-seam fs-3"></i>
                    </div>

                    <h5 className="fw-bold">
                      Products
                    </h5>

                    <p className="text-muted small">
                      Manage products, SKUs and product information.
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/products")}
                    >
                      View Products
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="col-xl-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="bg-success bg-opacity-10 text-success rounded-3 p-3 d-inline-flex mb-3">
                      <i className="bi bi-bar-chart-line fs-3"></i>
                    </div>

                    <h5 className="fw-bold">
                      Inventory
                    </h5>

                    <p className="text-muted small">
                      Track stock levels and inventory availability.
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/inventory")}
                    >
                      View Inventory
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="col-xl-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-3 d-inline-flex mb-3">
                      <i className="bi bi-cart3 fs-3"></i>
                    </div>

                    <h5 className="fw-bold">
                      Orders
                    </h5>

                    <p className="text-muted small">
                      Create, manage and monitor customer orders.
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => navigate("/orders")}
                    >
                      View Orders
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Warehouses */}
              <div className="col-xl-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 d-inline-flex mb-3">
                      <i className="bi bi-building fs-3"></i>
                    </div>

                    <h5 className="fw-bold">
                      Warehouses
                    </h5>

                    <p className="text-muted small">
                      Manage warehouse locations.
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/warehouses")}
                    >
                      View Warehouses
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
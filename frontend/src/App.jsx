import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Warehouse from "./pages/Warehouse";
import WarehouseDetails from "./pages/WarehouseDetails";
import AddWarehouse from "./pages/AddWarehouse";
import EditWarehouse from "./pages/EditWarehouse";
import Inventory from "./pages/Inventory";
import AddInventory from "./pages/AddInventory";
import EditInventory from "./pages/EditInventory";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";
import OrderDetails from "./pages/OrderDetails";
import EditOrder from "./pages/EditOrder";
import StockMovements from "./pages/StockMovements.jsx";
import EditOrderItem from "./pages/EditOrderItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
    
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
      />
        
      <Route
        path="/products/add"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />

        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <Warehouse />
            </ProtectedRoute>
          }
        />

          <Route
            path="/warehouses/:id"
            element={
              <ProtectedRoute>
                <WarehouseDetails />
              </ProtectedRoute>
            }
          />
      
      <Route
        path="/warehouses/add"
        element={
          <ProtectedRoute>
            <AddWarehouse />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/warehouses/:id/edit"
        element={
          <ProtectedRoute>
            <EditWarehouse />
          </ProtectedRoute>
        }
      />

      <Route path="/inventory" element={<Inventory />} />

      <Route
        path="/inventory/add"
        element={<AddInventory />}
      />

      <Route
        path="/inventory/:id/edit"
        element={<EditInventory />}
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/create"
        element={
          <ProtectedRoute>
            <CreateOrder />
          </ProtectedRoute>
        }
      />

        <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id/edit"
        element={
          <ProtectedRoute>
            <EditOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock-movements"
        element={
          <ProtectedRoute>
            <StockMovements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-items/:id/edit"
        element={
          <ProtectedRoute>
            <EditOrderItem />
          </ProtectedRoute>
        }
      />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
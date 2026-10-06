import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
        "Invalid username or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-info">

        <h1>
          Order & Inventory
          <br />
          Management
        </h1>

        <p>
          Manage orders, inventory and warehouse operations
          efficiently from one centralized system.
        </p>

        <div className="feature-list">
          <div>✓ Order Management</div>
          <div>✓ Inventory Tracking</div>
          <div>✓ Warehouse Management</div>
        </div>

      </div>

      {/* Right Side */}
      <div className="login-card">

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <div className="login-options">

            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot password?</a>

          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <div className="login-footer">
          Secure • Reliable • Efficient
        </div>

      </div>

    </div>
  );
}

export default Login;
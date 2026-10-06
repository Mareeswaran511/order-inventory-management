import { useEffect } from "react";

function ToastMessage({
  message,
  type = "success",
  show = false,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!show || !message) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, message, duration, onClose]);

  if (!show || !message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-3 text-bg-${
        isSuccess ? "success" : "danger"
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 1080 }}
    >
      <div className="d-flex align-items-center">
        <div className="toast-body fw-semibold">
          {isSuccess ? "✓" : "✕"} {message}
        </div>

        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default ToastMessage;
function MessageModal({
  show,
  title = "Unable to update order",
  message,
  onClose,
  type = "danger",
}) {
  if (!show || !message) {
    return null;
  }

  const isWarning = type === "warning";

  const iconClass = isWarning
    ? "bi-exclamation-triangle-fill"
    : "bi-exclamation-circle-fill";

  const iconColorClass = isWarning
    ? "text-warning"
    : "text-danger";

  const buttonClass = isWarning
    ? "btn-warning"
    : "btn-danger";

  const backgroundClass = isWarning
    ? "bg-warning"
    : "bg-danger";

  return (
    <>
      {/* BACKDROP */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
      ></div>

      {/* MODAL */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="messageModalTitle"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-3 shadow">

            {/* HEADER */}
            <div className="modal-header border-bottom">
              <h5
                className="modal-title fw-bold"
                id="messageModalTitle"
              >
                <i
                  className={`bi ${iconClass} ${iconColorClass} me-2`}
                ></i>

                {title}
              </h5>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* BODY */}
            <div className="modal-body py-4">
              <div className="d-flex align-items-start gap-3">

                {/* ICON */}
                <div
                  className={`rounded-circle ${backgroundClass} bg-opacity-10 p-3`}
                >
                  <i
                    className={`bi ${iconClass} ${iconColorClass} fs-4`}
                  ></i>
                </div>

                {/* MESSAGE */}
                <div className="pt-1">
                  <p className="mb-0 text-muted">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer border-top">
              <button
                type="button"
                className={`btn ${buttonClass} px-4`}
                onClick={onClose}
              >
                OK
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default MessageModal;
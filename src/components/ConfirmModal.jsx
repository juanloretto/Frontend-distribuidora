import React from "react";

const ConfirmModal = ({
  show,
  title = "Confirmar",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content shadow">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
              ></button>
            </div>

            <div className="modal-body">
              <p>{message}</p>

              {children && (
                <div className="mt-3">
                  {children}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>

              <button
                className="btn btn-success"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
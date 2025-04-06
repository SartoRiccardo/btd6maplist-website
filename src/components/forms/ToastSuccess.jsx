import { pFont } from "@/lib/fonts";
import LazyToast from "../transitions/LazyToast";

export default function ToastSuccess({ show, onClose, children }) {
  return (
    <LazyToast
      bg="success"
      className="notification"
      show={show}
      onClose={() => onClose(false)}
      delay={4000}
      autohide
    >
      <div className={`toast-body ${pFont.className}`} data-cy="toast-success">
        {children}
      </div>
    </LazyToast>
  );
}

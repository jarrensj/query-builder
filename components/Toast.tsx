type ToastProps = {
  // Empty hides the toast.
  message: string;
};

// The status region stays rendered while empty so screen readers announce each message as it appears.
const Toast = ({ message }: ToastProps) => (
  <div
    role="status"
    className="pointer-events-none fixed inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] z-10 flex justify-center px-5"
  >
    {message && (
      <p className="rounded-lg bg-accent px-4 py-2.5 text-[14px] font-medium text-white">{message}</p>
    )}
  </div>
);

export default Toast;

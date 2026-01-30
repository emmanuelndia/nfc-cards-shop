import Swal from "sweetalert2";

type ToastIcon = "success" | "error" | "warning" | "info" | "question";

type ToastOptions = {
  title: string;
  text?: string;
  timer?: number;
};

const fireToast = (icon: ToastIcon, { title, text, timer = 3000 }: ToastOptions) => {
  return Swal.fire({
    icon,
    title,
    text,
    position: "top",
    timer,
    showConfirmButton: false,
    toast: true,
    customClass: { container: "z-[999999]" },
  });
};

export const toast = {
  success: (options: ToastOptions) => fireToast("success", options),
  error: (options: ToastOptions) => fireToast("error", options),
  warning: (options: ToastOptions) => fireToast("warning", options),
  info: (options: ToastOptions) => fireToast("info", options),
};

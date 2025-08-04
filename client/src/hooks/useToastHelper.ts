import { useCallback } from "react";
import { toast } from "sonner";

export function useCustomToast() {
  const showSuccessToast = useCallback((message: string) => {
    toast.success("Success", {
      description: message,
      duration: 3000,
      position: "top-right",
      style: {
        background: "var(--success-bg)",
        color: "var(--success-text)",
        border: "1px solid var(--success-border)",
      },
    });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error("Error", {
      description: message,
      duration: 3000,
      position: "top-right",
      style: {
        background: "var(--error-bg)",
        color: "var(--error-text)",
        border: "1px solid var(--error-border)",
      },
    });
  }, []);

  const showInfoToast = useCallback((message: string) => {
    toast.info("Info", {
      description: message,
      duration: 3000,
      position: "top-right",
      style: {
        background: "var(--info-bg)",
        color: "var(--info-text)",
        border: "1px solid var(--info-border)",
      },
    });
  }, []);

  const showWarningToast = useCallback((message: string) => {
    toast.warning("Warning", {
      description: message,
      duration: 3000,
      position: "top-right",
      style: {
        background: "var(--warning-bg)",
        color: "var(--warning-text)",
        border: "1px solid var(--warning-border)",
      },
    });
  }, []);

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
}

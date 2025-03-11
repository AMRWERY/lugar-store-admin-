export function useToast() {
  const showToast = ref(false);
  const toastTitle = ref("");
  const toastMessage = ref("");
  const toastType = ref("");
  const toastIcon = ref("");

  const triggerToast = ({ title, message, type, icon }) => {
    toastTitle.value = title || "";
    toastMessage.value = message || "";
    toastType.value = type || "";
    toastIcon.value = icon || "";
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };

  return {
    showToast,
    toastTitle,
    toastMessage,
    toastType,
    toastIcon,
    triggerToast,
  };
}

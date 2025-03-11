export const useLoaderStore = defineStore("loader-store", {
  state: () => ({
    isLoading: false,
  }),

  actions: {
    showLoader() {
      return (this.isLoading = true);
    },

    hideLoader() {
      return (this.isLoading = false);
    },
  },
});

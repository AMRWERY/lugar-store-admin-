export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    user: null,
    isOverlayVisible: false,
  }),

  actions: {
    init() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    },
    
    async loginUser({ email, password }) {
      this.isOverlayVisible = true;
      try {
        const response = await $fetch(
          "https://lugarstore.com/api/users/login.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: { email, password },
            responseType: "json",
          }
        );
        if (response.status === "success") {
          this.user = { token: response.token, email };
          localStorage.setItem("user", JSON.stringify(this.user));
          this.error = null;
        } else {
          this.error = response.message || "Login failed";
          throw new Error(this.error);
        }
        setTimeout(() => {
          this.isOverlayVisible = false;
        }, 3000);
        return response;
      } catch (err) {
        this.error = err.message;
        setTimeout(() => {
          this.isOverlayVisible = false;
        }, 3000);
        throw err;
      }
    },

    async logoutUser() {
      this.isOverlayVisible = true;
      try {
        this.user = null;
        localStorage.clear();
        this.error = null;
        setTimeout(() => {
          this.isOverlayVisible = false;
        }, 3000);
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});

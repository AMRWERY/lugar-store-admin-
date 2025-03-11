export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    isLoading: false,
  }),

  actions: {
    fetchCart() {
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    },

    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    addToCart(
      id,
      title,
      titleAr,
      discountedPrice,
      originalPrice,
      imgOne,
      categoryId,
      subCategoryId,
      discount,
      quantity
    ) {
      const existingProduct = this.cart.find((item) => item.productId === id);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        this.cart.push({
          productId: id,
          title,
          titleAr,
          discountedPrice,
          originalPrice,
          imgOne,
          categoryId,
          subCategoryId,
          discount,
          quantity,
        });
      }
      this.saveCartToLocalStorage();
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter((item) => item.productId !== productId);
      this.saveCartToLocalStorage();
    },

    updateQuantityInCart(productId, newQuantity) {
      const product = this.cart.find((item) => item.productId === productId);
      if (product) {
        product.quantity = newQuantity;
        this.saveCartToLocalStorage();
      }
    },

    clearCart() {
      this.cart = [];
      localStorage.removeItem("cart");
    },
  },

  getters: {
    isInCart: (state) => (productId) => {
      return state.cart.some((item) => item.productId === productId);
    },
  },
});

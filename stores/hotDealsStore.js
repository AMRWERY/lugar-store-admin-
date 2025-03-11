export const useHotDealsProductsStore = defineStore("hot-deals", {
  state: () => ({
    products: [],
  }),

  actions: {
    fetchHotDealsProducts() {
      const endpoint =
        "https://lugarstore.com/api/products/get_discounted_products.php";
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          this.products = response;
          // console.log("Fetched products:", this.products);
          return response;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          throw error;
        });
    },
  },
});

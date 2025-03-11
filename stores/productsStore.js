export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    selectedProduct: null,
    categories: [],
    subCategories: [],
  }),

  actions: {
    createProduct(productData) {
      const endpoint = "https://lugarstore.com/api/products/create_product.php";
      return $fetch(endpoint, {
        method: "POST",
        body: productData,
        responseType: "json",
      })
        .then((response) => {
          const newProduct = { id: response.id, productData };
          this.products.push(newProduct);
          // console.log("Product added:", newProduct);
          return newProduct;
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          throw error;
        });
    },

    updateProduct(productId, updatedData) {
      const endpoint = "https://lugarstore.com/api/products/update_product.php";
      return $fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId, ...updatedData }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            const index = this.products.findIndex(
              (product) => product.id === productId
            );
            if (index !== -1) {
              this.products[index] = {
                ...this.products[index],
                ...updatedData,
              };
            }
            // console.log("Product updated successfully");
          } else {
            console.error(
              "API error during update:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          throw error;
        });
    },

    deleteProduct(productId) {
      const endpoint = "https://lugarstore.com/api/products/delete_product.php";
      return $fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            this.products = this.products.filter(
              (product) => product.id !== productId
            );
            // console.log("Product deleted successfully");
            return response;
          } else {
            console.error(
              "API error during deletion:",
              response.error || response.message || response
            );
            throw new Error(response.message || "Deletion failed");
          }
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          throw error;
        });
    },

    fetchProducts() {
      const endpoint = "https://lugarstore.com/api/products/get_products.php";
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

    fetchProductsByCategory(categoryId) {
      if (!categoryId) {
        // console.error("Category ID is required to fetch products by category");
        return Promise.resolve();
      }
      const endpoint = "https://lugarstore.com/api/products/get_products.php";
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          this.products = response.filter(
            (product) => String(product.categoryId) === String(categoryId)
          );
          // console.log("Filtered products:", this.products);
          return this.products;
        })
        .catch((error) => {
          console.error("Error fetching products by category:", error);
          throw error;
        });
    },

    fetchProductDetail(productId) {
      if (!productId) {
        // console.error("Product ID is missing or invalid");
        return Promise.resolve(null);
      }
      const endpoint =
        "https://lugarstore.com/api/products/get_product.php?id=" +
        encodeURIComponent(productId);
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          if (response) {
            this.selectedProduct = response;
            // console.log("Fetched product details:", response);
            return response;
          } else {
            console.error(`Product with ID ${productId} not found.`);
            return null;
          }
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          throw error;
        });
    },
  },

  getters: {
    inStockProducts() {
      return this.products.filter(
        (product) => product.availability === "In stock"
      ).length;
    },
  },
});

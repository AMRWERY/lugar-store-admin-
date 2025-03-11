export const useCategoriesStore = defineStore("categoriesStore", {
  state: () => ({
    categories: [],
    subCategories: [],
    paginatedCategories: [],
    paginatedSubcategories: [],
    currentPage: 1,
    categoriesPerPage: 5,
    subcategoriesPerPage: 6,
    currentCategory: null,
    currentMarketCategory: null,
  }),

  actions: {
    fetchCategories() {
      const endpoint =
        "https://lugarstore.com/api/categories/get_categories.php";
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          this.categories = response.data || response;
          if (typeof this.updatePagination === "function") {
            this.updatePagination();
          }
          // console.log("Fetched categories:", this.categories);
          return this.categories;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          throw error;
        });
    },

    fetchCategoryDetails(categoryId) {
      const endpoint =
        "https://lugarstore.com/api/categories/get_category.php?id=" +
        encodeURIComponent(categoryId);
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          if (response) {
            this.currentCategory = response;
            // console.log("Fetched category details:", response);
            return response;
          } else {
            console.error(`Category with ID ${categoryId} not found.`);
            return null;
          }
        })
        .catch((error) => {
          console.error("Error fetching category details:", error);
          throw error;
        });
    },

    updateCategory(categoryId, updatedData) {
      const endpoint =
        "https://lugarstore.com/api/categories/update_category.php";
      return $fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryId, ...updatedData }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            const index = this.categories.findIndex(
              (category) => category.id === categoryId
            );
            if (index !== -1) {
              this.categories[index] = {
                ...this.categories[index],
                ...updatedData,
              };
            }
            // console.log("Category updated successfully");
          } else {
            console.error(
              "API error during update:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error updating category:", error);
          throw error;
        });
    },

    addCategory(title, titleAr, imgOne) {
      const endpoint = "https://lugarstore.com/api/categories/add_category.php";
      return $fetch(endpoint, {
        method: "POST",
        body: { title, titleAr, imgOne },
        responseType: "json",
      })
        .then((response) => {
          const newCategory = { id: response.id, title, titleAr, imgOne };
          this.categories.push(newCategory);
          this.updatePagination();
          // console.log("Category added:", newCategory);
          return newCategory;
        })
        .catch((error) => {
          console.error("Error adding category:", error);
          throw error;
        });
    },

    deleteCategory(categoryId) {
      const endpoint =
        "https://lugarstore.com/api/categories/delete_category.php";
      return $fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryId }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            this.categories = this.categories.filter(
              (category) => category.id !== categoryId
            );
            this.updatePagination();
            // console.log("Category deleted successfully");
          } else {
            console.error(
              "API error during deletion:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
          throw error;
        });
    },

    fetchSubCategories() {
      const endpoint =
        "https://lugarstore.com/api/sub_categories/get_subcategories.php";
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          this.subCategories = response;
          if (typeof this.updatePagination === "function") {
            this.updatePagination();
          }
          // console.log("Fetched sub categories:", this.subCategories);
          return response;
        })
        .catch((error) => {
          console.error("Error fetching sub categories:", error);
          throw error;
        });
    },

    updateMarketCategory(categoryId, updatedData) {
      const endpoint =
        "https://lugarstore.com/api/sub_categories/update_subcategory.php";
      return $fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryId, ...updatedData }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            const index = this.categories.findIndex(
              (category) => category.id === categoryId
            );
            if (index !== -1) {
              this.subCategories[index] = {
                ...this.subCategories[index],
                ...updatedData,
              };
            }
            // console.log("Subcategory updated successfully");
          } else {
            console.error(
              "API error during update:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error updating category:", error);
          throw error;
        });
    },

    fetchCMarketCategoryDetails(marketCategoryId) {
      const endpoint =
        "https://lugarstore.com/api/sub_categories/get_subcategory.php?id=" +
        encodeURIComponent(marketCategoryId);
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          if (Array.isArray(response) && response.length > 0) {
            this.currentMarketCategory = response[0];
          } else {
            this.currentMarketCategory = response;
          }
          // console.log("Fetched sub category details:", this.currentMarketCategory);
          return this.currentMarketCategory;
        })
        .catch((error) => {
          console.error("Error fetching sub category details:", error);
          throw error;
        });
    },

    deleteMarketCategory(marketCategoryId) {
      const endpoint =
        "https://lugarstore.com/api/sub_categories/delete_subcategory.php";
      return $fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: marketCategoryId }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            this.subCategories = this.subCategories.filter(
              (marketCategory) => marketCategory.id !== marketCategoryId
            );
            this.updatePagination();
            // console.log("Sub Category deleted successfully");
          } else {
            console.error(
              "API error during deletion:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error deleting sub category:", error);
          throw error;
        });
    },

    addSubCategory(title, titleAr) {
      const endpoint =
        "https://lugarstore.com/api/sub_categories/create_subcategory.php";
      return $fetch(endpoint, {
        method: "POST",
        body: { title, titleAr },
        responseType: "json",
      })
        .then((response) => {
          const newSubCategory = { id: response.id, title, titleAr };
          this.subCategories.push(newSubCategory);
          if (typeof this.updatePagination === "function") {
            this.updatePagination();
          }
          // console.log("Sub Category added:", newSubCategory);
          return newSubCategory;
        })
        .catch((error) => {
          console.error("Error adding sub category:", error);
          throw error;
        });
    },

    updatePagination() {
      this.paginatedCategories = this.categories.slice(
        (this.currentPage - 1) * this.categoriesPerPage,
        this.currentPage * this.categoriesPerPage
      );
      this.paginatedSubcategories = this.subCategories.slice(
        (this.currentPage - 1) * this.subcategoriesPerPage,
        this.currentPage * this.subcategoriesPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },
  },

  getters: {
    getSubCategoriesByCategory: (state) => (categoryId) => {
      return state.subCategories.filter(
        (subCategory) => subCategory.categoryId === categoryId
      );
    },

    totalPages() {
      return Math.ceil(this.categories.length / this.categoriesPerPage);
    },

    totalPagesSubcategory() {
      return Math.ceil(this.categories.length / this.subcategoriesPerPage);
    },
  },
});

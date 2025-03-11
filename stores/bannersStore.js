export const useBannersStore = defineStore("banners", {
  state: () => ({
    banners: [],
    currentPage: 1,
    bannersPerPage: 5,
  }),

  actions: {
    fetchBanners() {
      const endpoint = "https://lugarstore.com/api/banners/get_banners.php";
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          const bannersArray = Array.isArray(response)
            ? response
            : response.data;
          const bannerList = bannersArray.map((doc) => ({
            id: doc.id,
            fileUrl: doc.fileUrl,
            visible: doc.visible ?? false,
            selected: doc.selected ?? false,
          }));
          this.banners = bannerList;
          // console.log("banners list", bannerList);
          return bannerList;
        })
        .catch((error) => {
          console.error("Error fetching banners:", error);
          throw error;
        });
    },

    addNewBanner(base64Image) {
      const payload = {
        fileUrl: base64Image,
        visible: true,
        selected: true,
      };
      const endpoint = "https://lugarstore.com/api/banners/create_banner.php";
      return $fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            const newBanner = {
              id: response.id,
              fileUrl: payload.fileUrl,
              visible: payload.visible,
              selected: payload.selected,
            };
            this.banners.push(newBanner);
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
              this.currentPage = this.totalPages;
            }
          }
          // console.log("Response (json):", response);
          return response;
        })
        .catch((error) => {
          console.error("Error adding banner:", error);
          throw error;
        });
    },

    toggleVisibility(bannerId) {
      const banner = this.banners.find((banner) => banner.id === bannerId);
      if (!banner) {
        // console.error("Banner not found");
        return Promise.reject("Banner not found");
      }
      const newVisible = !banner.visible;
      const newSelected = !banner.selected;
      const endpoint = "https://lugarstore.com/api/banners/update_banner.php";
      return $fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bannerId,
          visible: newVisible,
          selected: newSelected,
        }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            banner.visible = newVisible;
            banner.selected = newSelected;
            // console.log("Banner updated successfully");
          } else {
            console.error(
              "API error during update:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error updating banner:", error);
          throw error;
        });
    },

    deleteBanner(bannerId) {
      const endpoint = "https://lugarstore.com/api/banners/delete_banner.php";
      return $fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bannerId }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            this.banners = this.banners.filter(
              (banner) => banner.id !== bannerId
            );
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
              this.currentPage = this.totalPages;
            }
          }
          return response;
        })
        .catch((error) => {
          console.error("Error deleting banner:", error);
          throw error;
        });
    },

    updatePagination() {
      this.paginatedBanners = this.banners.slice(
        (this.currentPage - 1) * this.bannersPerPage,
        this.currentPage * this.bannersPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },

  getters: {
    totalPages() {
      return Math.ceil(this.banners.length / this.bannersPerPage);
    },

    paginatedBanners(state) {
      const start = (state.currentPage - 1) * state.bannersPerPage;
      return state.banners.slice(start, start + state.bannersPerPage);
    },
  },
});

export const useContactStore = defineStore("contact", {
  state: () => ({
    name: "",
    email: "",
    phone: "",
    message: "",
    messages: [],
    paginatedMessages: [],
    currentPage: 1,
    messagesPerPage: 5,
  }),

  actions: {
    submitForm(contactData) {
      const currentDate = new Date().toLocaleDateString("en-CA");
      const payload = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
        date: currentDate,
      };
      const endpoint = "https://lugarstore.com/api/messages/create_message.php";
      return $fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        responseType: "json",
      })
        .then((response) => {
          // console.log("Message submitted:", response);
          return response;
        })
        .catch((error) => {
          console.error("Error submitting message:", error);
          throw error;
        });
    },

    fetchMessages() {
      const endpoint = "https://lugarstore.com/api/messages/get_messages.php";
      return $fetch(endpoint, { responseType: "json" })
        .then((response) => {
          const messages = Array.isArray(response) ? response : response.data;
          this.messages = messages;
          this.updatePagination();
          return messages;
        })
        .catch((e) => {
          console.error("Error fetching messages: ", e);
          throw e;
        });
    },

    updatePagination() {
      this.paginatedMessages = this.messages.slice(
        (this.currentPage - 1) * this.messagesPerPage,
        this.currentPage * this.messagesPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    deleteMessage(messageId) {
      if (!messageId) {
        return;
      }
      const endpoint = "https://lugarstore.com/api/messages/delete_message.php";
      return $fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: messageId }),
        responseType: "json",
      })
        .then((response) => {
          if (response.success) {
            this.messages = this.messages.filter(
              (message) => message.id !== messageId
            );
            this.updatePagination();
          } else {
            console.error(
              "API error during deletion:",
              response.error || response.message || response
            );
          }
          return response;
        })
        .catch((error) => {
          console.error("Error removing message:", error);
          throw error;
        });
    },
  },

  getters: {
    allMessages: (state) => state.messages,

    totalPages() {
      return Math.ceil(this.messages.length / this.messagesPerPage);
    },
  },
});

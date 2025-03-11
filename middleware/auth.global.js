export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Skip middleware execution on the server
  if (process.server) return;

  // Wait for auth initialization on the client
  await authStore.init();

  // Redirect unauthenticated users trying to access protected routes
  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Redirect authenticated users away from the login page
  if (authStore.isAuthenticated && to.path === "/login") {
    return navigateTo("/products");
  }
});

<template>
  <div>
    <div class="max-w-7xl">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-s-1 md:space-s-2 rtl:space-s-reverse">
          <li class="inline-flex items-center">
            <nuxt-link to="/products"
              class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300">
              <i class="fa-solid fa-house me-2.5"></i>
              {{ $t('breadcrumb.home') }}
            </nuxt-link>
          </li>
          <li v-if="breadcrumbLabel">
            <div class="flex items-center">
              <i class="mx-1 text-gray-700 fa-solid fa-angle-right rtl:rotate-180 dark:text-gray-100"></i>
              <nuxt-link to=""
                class="text-sm font-medium text-gray-700 ms-1 hover:text-blue-600 md:ms-2 dark:text-gray-100 dark:hover:text-blue-300">{{
                  breadcrumbLabel }}</nuxt-link>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { t } = useI18n();

const breadcrumbLabel = computed(() => {
  if (route.params.id) {
    if (route.params.id === 'add-product') {
      return t('breadcrumb.add_product')
    } else if (route.path.startsWith('/all-products/')) {
      return t('breadcrumb.product_details')
    } else {
      return t('breadcrumb.edit_product')
    }
  }
  if (route.meta?.breadcrumb) {
    return t(`breadcrumb.${route.meta.breadcrumb}`);
  }
  if (route.name) {
    // Split route name to remove locale suffix (e.g., ___en)
    const [baseRouteName] = route.name.split('___');
    const formattedName = baseRouteName
      .replace(/-/g, '_')
      .toLowerCase();
    return t(`breadcrumb.${formattedName}`);
  }
  const pathSegments = route.path.split('/');
  return pathSegments[pathSegments.length - 1] || 'Unknown';
});
</script>
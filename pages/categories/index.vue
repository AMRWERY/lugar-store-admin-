<template>
  <div>
    <!--breadcrumb component -->
    <breadcrumb />
    
    <div class="flex items-center justify-between w-full mt-1 mb-3 ps-3">
      <div class="flex items-center">
        <h3 class="text-lg font-semibold text-slate-800">{{ $t('head.categories') }}</h3>
      </div>
      <nuxt-link to="/categories/add-category" type="button" class="flex items-center px-4 py-2.5 btn-style">
        <i class="fa-solid fa-plus me-2"></i>
        <span>{{ $t('btn.add_category') }}</span>
      </nuxt-link>
    </div>

    <div
      class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white rounded-lg shadow-md bg-clip-border">
      <table class="w-full table-auto text-start min-w-max">
        <thead>
          <tr>
            <th class="p-4 border-b border-slate-200 bg-slate-50">
              <p class="text-sm font-normal leading-none text-slate-500">
                #
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50">
              <p class="text-sm font-normal leading-none text-slate-500">
                {{ $t('form.category_title') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50">
              <p class="text-sm font-normal leading-none text-slate-500">
                {{ $t('dashboard.image') }}
              </p>
            </th>
          </tr>
        </thead>

        <tbody v-if="store.paginatedCategories.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <!-- skeleton-loader component -->
              <skeleton-loader />
              <!-- <i class="fa-solid fa-spinner fa-spin-pulse fa-4x"></i> -->
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr class="border-b hover:bg-slate-50 border-slate-200" v-for="(category, index) in store.paginatedCategories"
            :key="category.id">
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-800">
                {{ (store.currentPage - 1) * store.categoriesPerPage + index + 1 }}
              </p>
            </td>
            <td class="p-4 py-5">
              <p class="font-semibold text-md text-slate-500">{{ $i18n.locale === 'ar' ? category.titleAr :
                category.title }}</p>
            </td>
            <td class="p-4 py-5">
              <img :src="category.imgOne" class="w-12 h-12 rounded-lg">
            </td>
            <td class="p-4 py-5 text-center">
              <div class="flex items-center justify-center space-s-4">
                <nuxt-link :to="'/categories/' + category.id" type="button" class="rounded-full">
                  <i class="text-gray-600 fa-regular fa-pen-to-square"></i>
                </nuxt-link>

                <button type="button" class="rounded-full" @click="handleDeleteCategory(category.id)">
                  <i class="text-red-500 fa-solid fa-spinner fa-spin-pulse" v-if="deleteCat === category.id"></i>
                  <i class="text-red-600 fa-regular fa-trash-can" v-else></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-end px-4 py-3 mt-4">
        <div class="flex mt-3 space-s-1 ms-auto">
          <button @click="store.changePage(store.currentPage - 1)" :disabled="store.currentPage === 1"
            class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ $t('pagination.previous') }}
          </button>
          <button v-for="page in store.totalPages" :key="page" @click="store.changePage(page)" :class="{
            'bg-slate-800 text-white': page === store.currentPage,
            'bg-white text-slate-500': page !== store.currentPage,
          }"
            class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ page }}
          </button>
          <button @click="store.changePage(store.currentPage + 1)" :disabled="store.currentPage === store.totalPages"
            class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ $t('pagination.next') }}
          </button>
        </div>
      </div>
    </div>

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :title="toastTitle" :message="toastMessage" :toastType="toastType"
          :duration="5000" :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useCategoriesStore();

onMounted(() => {
  store.fetchCategories();
});

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()
const deleteCat = ref(null);

const handleDeleteCategory = (categoryId) => {
  deleteCat.value = categoryId;
  new Promise((resolve) => {
    setTimeout(resolve, 3000);
  })
    .then(() => {
      return store.deleteCategory(categoryId);
    })
    .then(() => {
      triggerToast({
        title: t('toast.great'),
        message: t('toast.category_deleted_successfully'),
        type: 'success',
        icon: 'fa-solid fa-circle-check',
      });
      deleteCat.value = null;
    })
    .catch((error) => {
      console.error("Error deleting category:", error);
      deleteCat.value = null;
      triggerToast({
        title: t('toast.error'),
        message: t('toast.failed_to_delete_category'),
        type: 'error',
        icon: 'fa-solid fa-triangle-exclamation',
      });
    });
};

const { t } = useI18n()

useHead({
  titleTemplate: () => t("head.categories"),
});
</script>
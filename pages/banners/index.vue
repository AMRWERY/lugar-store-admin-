<template>
  <div>
    <!--breadcrumb component -->
    <breadcrumb />

    <div class="flex items-center justify-between w-full mt-1 mb-3 ps-3">
      <div class="flex items-center">
        <h3 class="text-lg font-semibold text-slate-800">{{ $t('dashboard.banners') }}</h3>
      </div>
      <nuxt-link to="" type="button" class="flex items-center px-4 py-2.5 btn-style cursor-pointer" @click="openDialog">
        <i class="fa-solid fa-plus me-2"></i>
        <span>{{ $t('btn.add_banner') }}</span>
      </nuxt-link>
    </div>

    <div class="flex flex-col">
      <div class="overflow-x-auto shadow-md sm:rounded-lg">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden ">
            <table class="w-full table-auto text-start min-w-max">
              <thead>
                <tr>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      #
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      {{ $t('dashboard.banners') }}
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                  </th>
                </tr>
              </thead>

              <tbody v-if="bannersStore.paginatedBanners.length === 0">
                <tr>
                  <td colspan="10" class="p-4 text-center">
                    <!-- skeleton-loader component -->
                    <skeleton-loader />
                    <!-- <i class="fa-solid fa-spinner fa-spin-pulse fa-4x"></i> -->
                  </td>
                </tr>
              </tbody>

              <tbody v-else>
                <tr class="border-b hover:bg-slate-50 border-slate-200"
                  v-for="(banner, index) in bannersStore.paginatedBanners" :key="banner.id">
                  <td class="p-4 py-5">
                    <input id="checkbox-table-1" type="checkbox" :checked="banner.visible"
                      @change="bannersStore.toggleVisibility(banner.id)"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="checkbox-table-1" class="sr-only">checkbox</label>
                  </td>
                  <td class="p-4 py-5">
                    <p class="block text-sm text-slate-500">{{ (bannersStore.currentPage - 1) *
                      bannersStore.bannersPerPage + index + 1 }}</p>
                  </td>
                  <td class="p-4 py-5">
                    <img :src="banner.fileUrl" class="w-16 h-12 rounded-lg image-zoom">
                  </td>
                  <td class="p-4 py-5">
                    <button type="button" class="rounded-full" @click="handleDeleteBanner(banner.id)">
                      <i class="text-red-500 fa-solid fa-spinner fa-spin-pulse" v-if="deleteBanner === banner.id"></i>
                      <i class="text-red-600 fa-regular fa-trash-can" v-else></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="flex items-center justify-end px-4 py-3 mt-4">
              <div class="flex mt-3 space-s-1 ms-auto">
                <button @click="bannersStore.changePage(bannersStore.currentPage - 1)"
                  :disabled="bannersStore.currentPage === 1"
                  class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
                  {{ $t('pagination.previous') }}
                </button>
                <button v-for="page in bannersStore.totalPages" :key="page" @click="bannersStore.changePage(page)"
                  :class="{
                    'bg-slate-800 text-white': page === bannersStore.currentPage,
                    'bg-white text-slate-500': page !== bannersStore.currentPage,
                  }"
                  class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
                  {{ page }}
                </button>
                <button @click="bannersStore.changePage(bannersStore.currentPage + 1)"
                  :disabled="bannersStore.currentPage === bannersStore.totalPages"
                  class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
                  {{ $t('pagination.next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- banners-dialog component -->
    <banners-dialog v-if="isDialogOpen" :isOpen="isDialogOpen" @close="closeDialog" />

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
const bannersStore = useBannersStore();

onMounted(() => {
  bannersStore.fetchBanners();
});

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()
const deleteBanner = ref(null);

const handleDeleteBanner = (bannerId) => {
  deleteBanner.value = bannerId;
  new Promise((resolve) => {
    setTimeout(resolve, 3000);
  })
    .then(() => {
      return bannersStore.deleteBanner(bannerId);
    })
    .then(() => {
      triggerToast({
        title: t('toast.great'),
        message: t('toast.banner_deleted_successfully'),
        type: 'success',
        icon: 'fa-solid fa-circle-check',
      });
      deleteBanner.value = null;
    })
    .catch((error) => {
      console.error("Error deleting banner:", error);
      deleteBanner.value = null;
      triggerToast({
        title: t('toast.error'),
        message: t('toast.failed_to_delete_banner'),
        type: 'error',
        icon: 'fa-solid fa-triangle-exclamation',
      });
    });
};

const isDialogOpen = ref(false);
const { t } = useI18n()

const openDialog = () => {
  isDialogOpen.value = true;
};
const closeDialog = () => {
  isDialogOpen.value = false;
};

useHead({
  titleTemplate: () => t("head.banners"),
});
</script>

<style scoped>
.image-zoom {
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.image-zoom:hover {
  transform: scale(5);
  transform-origin: center center;
}
</style>
<template>
  <div>
    <HeadlessTransitionRoot appear :show="isOpen" as="template">
      <HeadlessDialog as="div" @close="closeDialog" class="relative z-10">
        <HeadlessTransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
          enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/25" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-full p-4 text-center">
            <HeadlessTransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <HeadlessDialogPanel
                class="w-full max-w-4xl p-4 mx-4 overflow-hidden align-middle transition-all transform bg-white shadow-xl text-start rounded-2xl sm:p-6 sm:mx-6">
                <HeadlessDialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  <div class="flex justify-between mb-4">
                    <p>{{ $t('dashboard.order_number') }} <span class="font-semibold">{{ order.orderId }}</span></p>
                    <button role="button" @click="closeDialog">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </HeadlessDialogTitle>
                <div class="mt-2">
                  <div class="flex flex-col w-full max-w-4xl p-6 bg-white rounded-lg">
                    <div v-if="orders?.length" class="grid gap-6 md:grid-cols-2 md:gap-8">
                      <!-- Customer Info Section -->
                      <div class="flex-1 p-6 rounded-lg shadow-md bg-gray-50">
                        <h3 class="mb-4 text-xl font-semibold text-gray-900">
                          {{ order.name }} {{ $t('dashboard.s_information') }}
                        </h3>
                        <div class="space-y-3">
                          <p class="text-sm text-gray-700">
                            <span class="font-semibold">{{ $t('dashboard.email') }}:</span>
                            {{ order.email }}
                          </p>
                          <p class="text-sm text-gray-700">
                            <span class="font-semibold">{{ $t('dashboard.phone_number') }}:</span>
                            {{ order.phoneNumber }}
                          </p>
                          <p class="text-sm text-gray-700">
                            <span class="font-semibold">{{ $t('dashboard.state') }}:</span>
                            {{ order.state }}
                          </p>
                          <p class="text-sm text-gray-700">
                            <span class="font-semibold">{{ $t('dashboard.address') }}:</span>
                            {{ order.address }}
                          </p>
                        </div>

                        <!-- Status Buttons -->
                        <div class="mt-12">
                          <p class="text-sm font-normal text-gray-600">{{ $t('dashboard.change_order_status') }}</p>
                          <div class="flex flex-wrap gap-4 mt-12 sm:flex-nowrap">
                            <button type="button"
                              :disabled="order.statusId === orderStatus[1]?.id || order.statusId === orderStatus[0]?.id || order.statusId === orderStatus[2]?.id"
                              @click="updateOrderStatus(order.id, orderStatus[1]?.id)"
                              class="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:text-green-600 dark:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed">
                              <i class="fa-solid fa-spinner fa-spin-pulse"
                                v-if="order.loading && order.targetStatus === orderStatus[1]?.id"></i>
                              <span v-else>{{ $i18n.locale === 'ar' ? orderStatus[1]?.statusAr :
                                orderStatus[1]?.status }}</span>
                            </button>
                            <button type="button"
                              :disabled="order.statusId === orderStatus[2]?.id || order.statusId === orderStatus[0]?.id"
                              @click="updateOrderStatus(order.id, orderStatus[2]?.id)"
                              class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:text-red-600 dark:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed">
                              <i class="fa-solid fa-spinner fa-spin-pulse"
                                v-if="order.loading && order.targetStatus === orderStatus[2]?.id"></i>
                              <span v-else>{{ $i18n.locale === 'ar' ? orderStatus[2]?.statusAr :
                                orderStatus[2]?.status }}</span>
                            </button>
                            <button type="button" :disabled="order.statusId === orderStatus[0]?.id"
                              @click="updateOrderStatus(order.id, orderStatus[0].id)"
                              class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:text-blue-600 dark:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                              <i class="fa-solid fa-spinner fa-spin-pulse"
                                v-if="order.loading && order.targetStatus === orderStatus[0]?.id"></i>
                              <span v-else>{{ $i18n.locale === 'ar' ? orderStatus[0]?.statusAr :
                                orderStatus[0]?.status }}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Order Details Section with Hidden Scroll -->
                      <div class="flex-1 p-6 bg-white rounded-lg shadow-md">
                        <h3 class="mb-4 text-xl font-semibold text-gray-900">
                          {{ $t('order_summary.order_details') }}
                        </h3>
                        <div class="space-y-4 overflow-y-auto max-h-[50vh] custom-scroll md:max-h-96">
                          <div v-for="(item, index) in order.cart || []" :key="item.productId"
                            class="flex items-center pb-4 border-b space-s-4">
                            <span class="text-xl font-semibold text-gray-700">{{ index + 1 }}.</span>
                            <img :src="item.imgOne" class="w-16 h-16 rounded-md shadow-sm" />
                            <div class="flex-1">
                              <p class="text-lg font-semibold text-gray-900">
                                {{ $i18n.locale === 'ar' ? item.titleAr : item.title }}
                              </p>
                              <p class="text-sm text-gray-700">
                                <span class="font-semibold">{{ $t('order_summary.category') }}:</span>
                                {{ $i18n.locale === 'ar' ? categories[0]?.titleAr :
                                  categories[0]?.title }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>

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
const props = defineProps({
  order: Object,
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const checkoutStore = useCheckoutStore();
const categoryStore = useCategoriesStore();
const orders = computed(() => checkoutStore?.orders || []);

const closeDialog = () => {
  emit('close');
};

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const { t } = useI18n()

const updateOrderStatus = async (orderId, newStatus) => {
  const order = checkoutStore.paginatedOrders.find((o) => o.id === orderId);
  if (!order) return;
  order.loading = true;
  order.targetStatus = newStatus;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await checkoutStore.updateOrderStatus(orderId, newStatus)
    .then((rss) => {
      checkoutStore.fetchOrders();
      triggerToast({
        title: t('toast.great'),
        message: t('toast.order_status_updated'),
        type: 'success',
        icon: 'fa-solid fa-circle-check',
      });
      order.loading = false
    })
    .catch((error) => {
      console.error(error);
      triggerToast({
        title: t('toast.error'),
        message: t('toast.failed_to_update_order'),
        type: 'error',
        icon: 'fa-solid fa-triangle-exclamation',
      });
    })
    .finally(() => {
      const order = checkoutStore.paginatedOrders.find((o) => o.id === orderId);
      if (order) {
        order.loading = false;
        order.targetStatus = null;
      }
    })
};

const orderStatus = ref([])
const categories = ref([])
const currentStatus = ref('')

onMounted(() => {
  checkoutStore
    .fetchStatus()
    .then(() => {
      orderStatus.value = checkoutStore.status;
      return categoryStore.fetchCategories();
    })
    .then(() => {
      categories.value = categoryStore.categories;
      currentStatus.value = checkoutStore.status.find(
        (s) => s.id === props.order.statusId
      )?.status;
    })
    .catch((error) => {
      console.error("Error in onMounted chain:", error);
    });
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  display: none;
}

.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
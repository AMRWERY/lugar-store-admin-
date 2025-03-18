<template>
  <div>
    <!--breadcrumb component -->
    <breadcrumb />

    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label for="category" class="block mb-2 text-sm font-medium text-gray-700">
            {{ $t('form.category') }}
          </label>
          <select id="category" v-model="selectedCategory" @change="applyFilter"
            class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="" disabled selected>{{ $t('form.select_a_category') }}</option>
            <option value="">{{ $t('form.all_categories') }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}</option>
          </select>
        </div>

        <div>
          <label for="subcategory" class="block mb-2 text-sm font-medium text-gray-700">
            {{ $t('form.marketing_categories') }}
          </label>
          <select id="subcategory" v-model="selectedSubcategory" @change="applyFilter"
            class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="" disabled selected>{{ $t('form.select_marketing_category') }}</option>
            <option value="">{{ $t('form.all_marketing_categories') }}</option>
            <option v-for="category in subCategories" :key="category.id" :value="category.id">{{ category.title }}
            </option>
          </select>
        </div>

        <div>
          <label for="availability" class="block mb-2 text-sm font-medium text-gray-700">
            {{ $t('form.availability') }}
          </label>
          <select id="availability" v-model="selectedAvailability" @change="applyFilter"
            class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="" disabled selected>{{ $t('form.select_availability') }}</option>
            <option value="">{{ $t('form.all_availability') }}</option>
            <option v-for="available in uniqueAvailability" :key="available" :value="available">{{ available }}</option>
          </select>
        </div>

        <div class="flex items-end justify-end">
          <nuxt-link to="/products/add-product" type="button"
            class="flex items-center px-4 py-2.5 btn-style w-full sm:w-auto justify-center">
            <i class="fa-solid fa-plus me-2"></i>
            <span>{{ $t('btn.add_product') }}</span>
          </nuxt-link>
        </div>
      </div>


      <!-- Loading Spinner -->
      <!-- <div v-if="loading" class="flex items-center justify-center h-48 text-gray-600">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-6x"></i>
      </div>

      <div v-else-if="!filteredProducts?.length" class="flex items-center justify-center h-48 text-gray-600">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-6x"></i>
      </div> -->

      <div v-if="filteredProducts?.length === 0">
        <!-- skeleton-loader component -->
        <skeleton-loader />
      </div>

      <div
        class="grid mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-6 sm:grid-cols-1 md:grid-cols-2 sm:gap-4"
        v-else>
        <div
          class="flex flex-col w-full max-w-xs mx-auto overflow-hidden border border-gray-100 rounded-lg shadow-md group"
          v-for="product in paginatedProducts" :key="product.id">
          <!-- Card Body with Flex Layout -->
          <div class="flex flex-col h-full">
            <nuxt-link to="" class="relative flex overflow-hidden h-60 rounded-xl">
              <img class="absolute top-0 right-0 object-cover w-full h-full peer" :src="product.imgOne" />
              <img v-if="product.imgTwo"
                class="absolute top-0 object-cover w-full h-full transition-all duration-1000 delay-100 peer -right-96 hover:right-0 peer-hover:right-0"
                :src="product.imgTwo" />
              <ClientOnly>
                <nuxt-link :to="'/products/' + product.id" type="button"
                  class="absolute p-0.5 bg-white rounded-full shadow-lg top-2 end-2">
                  <i class="text-gray-600 fa-regular fa-pen-to-square"></i>
                </nuxt-link>
              </ClientOnly>
              <button @click="deleteProduct(product.id)"
                class="absolute p-0.5 bg-white rounded-full shadow-lg top-12 end-2">
                <i class="text-red-500 fa-solid fa-spinner fa-spin-pulse" v-if="deleteProd === product.id"></i>
                <i class="text-red-600 fa-regular fa-trash-can" v-else></i>
              </button>
            </nuxt-link>
            <div class="flex flex-col justify-end flex-grow px-5 pb-2 mt-6">
              <nuxt-link to="">
                <h5 class="text-xl tracking-tight text-slate-900">
                  {{ $i18n.locale === 'ar' ? product.titleAr :
                    product.title }}
                </h5>
              </nuxt-link>
              <div class="flex items-center justify-between mt-2">
                <p>
                  <span class="text-3xl font-bold text-slate-900 me-2">{{ product.discountedPrice }} {{
                    $t('products.le') }}</span>
                  <span class="text-sm line-through text-slate-900" v-if="product.originalPrice">
                    {{ product.originalPrice }} {{ $t('products.le') }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center mt-10">
        <!-- pagination component -->
        <pagination :total-pages="totalPages" :current-page="currentPage" @page-changed="onPageChanged" />
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
const store = useProductsStore();
const productStore = useProductsStore()
const categoryStore = useCategoriesStore()
const currentPage = ref(1);
const perPage = 10;
const selectedSubcategory = ref('');
const selectedCategory = ref('');
const selectedAvailability = ref('');
// const loading = ref(false);

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const deleteProd = ref(null);

const categories = ref([])
const subCategories = ref([])
const filteredProducts = ref([]);

onMounted(() => {
  store.fetchProducts().then(() => {
    filteredProducts.value = store.products
  });
  categoryStore.fetchCategories().then(() => {
    categories.value = categoryStore.categories;
  }).then(() => {
    return categoryStore.fetchSubCategories();
  }).then(() => {
    subCategories.value = categoryStore.subCategories;
  }).catch((error) => {
    return error
  });
});

const applyFilter = () => {
  filteredProducts.value = store.products;
  filteredProducts.value = filteredProducts.value.filter((product) => {
    const matchesCategory =
      !selectedCategory.value || product.categoryId === selectedCategory.value;
    const matchesSubcategory =
      !selectedSubcategory.value || product.subCategoryId === selectedSubcategory.value;
    const matchesAvailability =
      !selectedAvailability.value || product.availability === selectedAvailability.value;
    return matchesCategory && matchesSubcategory && matchesAvailability;
  });
};

const uniqueAvailability = computed(() => {
  return [...new Set(store.products.map((product) => product.availability))];
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value?.length / perPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return filteredProducts.value.slice(start, end);
});

const onPageChanged = (pageNumber) => {
  currentPage.value = pageNumber;
};

const { t } = useI18n()

const deleteProduct = (productId) => {
  deleteProd.value = productId;
  productStore.deleteProduct(productId)
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    })
    .then(() => {
      deleteProd.value = null;
      store.products = store.products.filter(product => product.id !== productId);
      applyFilter();
      triggerToast({
        title: t('toast.great'),
        message: t('toast.product_deleted_successfully'),
        type: 'success',
        icon: 'fa-solid fa-circle-check',
      });
    })
    .catch((error) => {
      deleteProd.value = null;
      triggerToast({
        title: t('toast.error'),
        message: t('toast.failed_to_delete_the_product'),
        type: 'error',
        icon: 'mdi-alert-circle',
      });
    });
};
</script>
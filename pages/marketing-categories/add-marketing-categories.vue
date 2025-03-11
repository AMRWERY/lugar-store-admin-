<template>
  <div>
     <!--breadcrumb component -->
     <breadcrumb />
     
    <div class="max-w-2xl p-6 mx-auto mt-5 bg-white border rounded-lg">

      <h2 class="mt-8 mb-4 text-xl font-bold">{{ $t('form.add_marketing_category') }}</h2>
      <form @submit.prevent="handleAddSubCategory">
        <div class="mb-4">
          <label for="subcategory-title" class="block text-sm font-medium text-gray-700">{{
            $t('form.marketing_category_title')
            }}</label>
          <input id="subcategory-title" type="text" v-model="newSubCategoryTitle"
            class="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            :placeholder="$t('form.enter_marketing_category_title')" required />
        </div>

        <div class="mb-4">
          <label for="subcategory-title" class="block text-sm font-medium text-gray-700">{{
            $t('form.marketing_category_title_ar')
            }}</label>
          <input id="subcategory-title" type="text" v-model="newSubCategoryTitleAr"
            class="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            :placeholder="$t('form.enter_marketing_category_title_ar')" required />
        </div>

        <!-- <div class="mb-4">
          <div class="mx-auto overflow-hidden rounded-lg ">
            <div class="md:flex">
              <div class="w-full">
                <div
                  class="relative flex items-center justify-center h-48 bg-gray-100 border-2 border-blue-700 border-dashed border-dotted rounded-lg">
                  <div class="absolute">
                    <div class="flex flex-col items-center">
                      <i class="fa-solid fa-image fa-4x"></i>
                      <span class="block font-normal text-gray-400">{{ $t('form.attach_your_files_here') }}</span>
                    </div>
                  </div>
                  <input type="file" class="w-full h-full opacity-0" @change="handleFileChange" multiple>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center mb-4 space-s-6">
          <div v-if="product.imgOne" class="mt-4 border border-gray-200">
            <img :src="product.imgOne" class="w-48 h-32 rounded-lg">
          </div>
        </div> -->

        <button type="submit" class="w-full px-4 py-2 btn-style">
          <div class="flex items-center justify-center" v-if="loadingTwo">
            <span class="text-center me-2">{{ $t('loading_btn.please_wait') }}...</span>
            <i class="fa-solid fa-spinner fa-spin-pulse"></i>
          </div>
          <span v-else>{{ $t('btn.add_marketing_category') }}</span>
        </button>
      </form>
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
const loadingTwo = ref(false);
const newSubCategoryTitle = ref('');
const newSubCategoryTitleAr = ref('');
const product = ref({})

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()

const handleAddSubCategory = () => {
  loadingTwo.value = true;
  store
    .addSubCategory(
      newSubCategoryTitle.value.trim(),
      newSubCategoryTitleAr.value.trim()
    )
    .then(() => {
      resetForm();
      triggerToast({
        title: t('toast.great'),
        message: t('toast.marketing_category_added_successfully'),
        type: 'success',
        icon: 'fa-solid fa-circle-check',
      });
    })
    .catch((error) => {
      triggerToast({
        title: t('toast.error'),
        message: t('toast.subcategory_add_failed'),
        type: 'error',
        icon: 'fa-solid fa-triangle-exclamation',
      });
    })
    .finally(() => {
      newSubCategoryTitle.value = '';
      newSubCategoryTitleAr.value = '';
      loadingTwo.value = false;
    });
};

const resetForm = () => {
  product.value = { title: '', titleAr: '' };
};

const { t } = useI18n()

useHead({
  titleTemplate: () => t("head.add_marketing_category"),
});
</script>
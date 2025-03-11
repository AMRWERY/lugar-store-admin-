<template>
  <div>
    <!--breadcrumb component -->
    <breadcrumb />
    
    <div class="max-w-2xl p-6 mx-auto mt-5 bg-white border rounded-lg">
      <h2 class="mb-4 text-xl font-bold">{{ $t('form.add_category') }}</h2>
      <form @submit.prevent="handleAddCategory">
        <div class="mb-4">
          <label for="category-title" class="block text-sm font-medium text-gray-700">{{ $t('form.category_title')
          }}</label>
          <input id="category-title" type="text" v-model="newCategoryTitle"
            class="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            :placeholder="$t('form.enter_category_title')" required />
        </div>

        <div class="mb-4">
          <label for="category-title" class="block text-sm font-medium text-gray-700">{{ $t('form.category_title_ar')
          }}</label>
          <input id="category-title" type="text" v-model="newCategoryTitleAr"
            class="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            :placeholder="$t('form.enter_category_title_ar')" required />
        </div>

        <div class="mb-4">
          <div class="mx-auto overflow-hidden rounded-lg">
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
                  <input type="file" ref="fileInput" id="fileInput" class="w-full h-full opacity-0"
                    @change="uploadFile">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center mb-4 space-s-6" v-if="previewImage">
          <img :src="previewImage" class="w-48 h-32 rounded-lg">
        </div>

        <button type="submit" class="w-full px-4 py-2 btn-style">
          <div class="flex items-center justify-center" v-if="loadingOne">
            <span class="text-center me-2">{{ $t('loading_btn.please_wait') }}...</span>
            <i class="fa-solid fa-spinner fa-spin-pulse"></i>
          </div>
          <span v-else>{{ $t('btn.add_category') }}</span>
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
const loadingOne = ref(false);
const newCategoryTitle = ref('');
const newCategoryTitleAr = ref('');
const previewImage = ref("");
const uploadedImageUrl = ref('');
const fileInput = ref(null);

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()
const { t } = useI18n()

async function uploadFile() {
  if (!fileInput.value) {
    // console.error("File input element not found");
    return;
  }
  const file = fileInput.value.files[0];
  if (!file) {
    alert('Please select a file.');
    return;
  }
  const formData = new FormData();
  formData.append('fileToUpload', file);
  try {
    const config = useRuntimeConfig();
    const uploadEndpoint = "https://lugarstore.com/upload.php";
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    const responseEl = document.getElementById('response');
    if (responseEl) {
      responseEl.innerText = JSON.stringify(result, null, 2);
    }
    if (result.success) {
      triggerToast({
        title: t('toast.great'),
        message: t('toast.image_uploaded_successfully'),
        type: 'success',
        icon: 'fa-solid fa-circle-check',
      });
      uploadedImageUrl.value = result.file_url;
      previewImage.value = result.file_url;
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    // console.error('Error uploading file:', error);
    triggerToast({
      title: t('toast.error'),
      message: t('toast.faield_to_upload_image'),
      type: 'error',
      icon: 'fa-solid fa-triangle-exclamation',
    });
  }
}

const handleAddCategory = () => {
  loadingOne.value = true;
  if (newCategoryTitle.value.trim() && uploadedImageUrl.value) {
    store
      .addCategory(
        newCategoryTitle.value.trim(),
        newCategoryTitleAr.value.trim(),
        uploadedImageUrl.value
      )
      .then(() => {
        triggerToast({
          title: t('toast.great'),
          message: t('toast.category_added_successfully'),
          type: 'success',
          icon: 'fa-solid fa-circle-check',
        });
        newCategoryTitle.value = '';
        newCategoryTitleAr.value = '';
        uploadedImageUrl.value = '';
      })
      .catch((error) => {
        console.error("Error adding category:", error);
        triggerToast({
          title: t('toast.error'),
          message: t('toast.category_add_failed'),
          type: 'error',
          icon: 'fa-solid fa-triangle-exclamation',
        });
      })
      .finally(() => {
        loadingOne.value = false;
      });
  } else {
    loadingOne.value = false;
  }
};

useHead({
  titleTemplate: () => t("head.add_category"),
});
</script>
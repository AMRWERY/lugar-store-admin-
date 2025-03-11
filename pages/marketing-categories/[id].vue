<template>
    <div>
         <!--breadcrumb component -->
    <breadcrumb />
    
        <div class="max-w-2xl p-6 mx-auto mt-5 bg-white border rounded-lg">
            <h2 class="mb-4 text-xl font-bold">{{ $t('form.edit_marketing_category') }}</h2>
            <form @submit.prevent="handleUpdateMarketCategory">
                <div class="mb-4">
                    <label for="category-title" class="block text-sm font-medium text-gray-700">{{
                        $t('form.marketing_category_title')
                        }}</label>
                    <input id="category-title" type="text" v-model="newMarketCategoryTitle"
                        class="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300" required />
                </div>

                <div class="mb-4">
                    <label for="category-title" class="block text-sm font-medium text-gray-700">{{
                        $t('form.marketing_category_title_ar')
                        }}</label>
                    <input id="category-title" type="text" v-model="newMarketCategoryTitleAr"
                        class="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300" required />
                </div>

                <button type="submit" class="w-full px-4 py-2 btn-style">
                    <div class="flex items-center justify-center" v-if="loadingOne">
                        <span class="text-center me-2">{{ $t('loading_btn.please_wait') }}...</span>
                        <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                    </div>
                    <span v-else>{{ $t('btn.update_marketing_category') }}</span>
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
const newMarketCategoryTitle = ref('');
const newMarketCategoryTitleAr = ref('');
const route = useRoute();
const marketCategoryId = route.params.id

onMounted(() => {
    if (marketCategoryId) {
        store.fetchCMarketCategoryDetails(marketCategoryId)
            .then(() => {
                if (store.currentMarketCategory) {
                    newMarketCategoryTitle.value = store.currentMarketCategory.title || "";
                    newMarketCategoryTitleAr.value = store.currentMarketCategory.titleAr || "";
                }
            })
            .catch((error) => {
                console.error("Error fetching market category details:", error);
            });
    }
});

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()
const { t } = useI18n()

const handleUpdateMarketCategory = () => {
    if (!marketCategoryId) return;
    loadingOne.value = true;
    const updatedData = {
        title: newMarketCategoryTitle.value,
        titleAr: newMarketCategoryTitleAr.value,
    };
    store
        .updateMarketCategory(marketCategoryId, updatedData)
        .then(() => {
            triggerToast({
                title: t('toast.success'),
                message: t('toast.marketing_category_updated'),
                type: 'success',
                icon: 'fa-solid fa-circle-check',
            });
            return store.fetchCMarketCategoryDetails(marketCategoryId);
        })
        .catch((error) => {
            // console.error("Error updating category:", error);
            triggerToast({
                title: t('toast.error'),
                message: t('toast.marketing_category_update_failed'),
                type: 'error',
                icon: 'fa-solid fa-triangle-exclamation',
            });
        })
        .finally(() => {
            loadingOne.value = false;
        });
};

useHead({
    titleTemplate: () => t("head.edit_marketing_category"),
});
</script>
<template>
    <div>
        <!--breadcrumb component -->
        <breadcrumb />

        <section class="py-6">
            <div class="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
                <div class="py-6 md:py-0 md:px-6">
                    <h1 class="text-4xl font-bold">{{ $t('contact_us.get_in_touch') }}</h1>
                    <p class="pt-2 pb-4">{{ $t('contact_us.fill_in_the_form_to_start_a_conversation') }}</p>
                    <div class="space-y-4">
                        <p class="flex items-center">
                            <i class="fa-solid fa-location-dot me-2 sm:me-6"></i>
                            <span>{{ $t('footer.damietta') }}</span>
                        </p>
                        <p class="flex items-center">
                            <i class="fa-solid fa-phone-volume me-2 sm:me-6"></i>
                            <span>+2010-233-51915</span>
                        </p>
                    </div>
                </div>

                <div class="w-full p-4 space-y-4 rounded-lg shadow-lg">
                    <form @submit.prevent="sendMessage">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                                <label for="your-name" class="block font-medium text-gray-900 text-sm/6">{{
                                    $t('form.name') }}</label>
                                <div class="mt-1">
                                    <input type="text" name="your-name" id="your-name"
                                        :placeholder="t('form.enter_your_name')" autocomplete="your-name"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        v-model="data.name" />
                                </div>
                                <p v-if="nameError" class="mt-1 text-sm font-semibold text-red-500">{{ nameError }}</p>
                            </div>

                            <div class="col-span-full">
                                <label for="your-email" class="block font-medium text-gray-900 text-sm/6">{{
                                    $t('form.email') }}</label>
                                <div class="mt-1">
                                    <input type="email" name="your-email" id="your-email"
                                        :placeholder="t('form.enter_your_email')" autocomplete="your-email"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        v-model="data.email" />
                                </div>
                                <p v-if="emailError" class="mt-1 text-sm font-semibold text-red-500">{{ emailError }}
                                </p>
                            </div>

                            <div class="col-span-full">
                                <label for="your-email" class="block font-medium text-gray-900 text-sm/6">{{
                                    $t('form.phone_number') }}</label>
                                <div class="mt-1">
                                    <input type="tel" name="your-phone" id="your-phone"
                                        :placeholder="t('form.enter_your_phone')"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        v-model="data.phone" />
                                </div>
                                <p v-if="phoneError" class="mt-1 text-sm font-semibold text-red-500">{{ phoneError }}
                                </p>
                            </div>

                            <div class="col-span-full">
                                <label for="about" class="block font-medium text-gray-900 text-sm/6">{{
                                    $t('form.your_message')
                                }}</label>
                                <div class="mt-1">
                                    <textarea name="about" id="about" rows="3"
                                        :placeholder="t('form.enter_your_message')" type="textarea"
                                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        v-model="data.message" />
                                </div>
                                <p v-if="messageError" class="mt-1 text-sm font-semibold text-red-500">{{ messageError
                                    }}</p>
                            </div>

                        </div>
                        <div class="mt-6">
                            <button type="submit" class="w-full px-4 py-2 btn-style">
                                <div class="flex items-center justify-center" v-if="loading">
                                    <span class="text-center me-2">{{ $t('loading_btn.sending') }}...</span>
                                    <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                                </div>
                                <span v-else>{{ $t('btn.send_your_message') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- dynamic-toast component  -->
        <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
            <div class="pointer-events-auto">
                <dynamic-toast v-if="showToast" :title="toastTitle" :message="toastMessage" :toastType="toastType"
                    :duration="5000" :toastIcon="toastIcon" @toastClosed="showToast = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
const store = useContactStore();
const { t } = useI18n()
const loading = ref(false);
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const data = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
});

const nameError = ref('');
const emailError = ref('');
const phoneError = ref('');
const messageError = ref('');

const validateForm = () => {
    nameError.value = '';
    emailError.value = '';
    phoneError.value = '';
    messageError.value = '';
    if (!data.value.name) {
        nameError.value = t('form.your_name_is_required');
    }
    if (!data.value.email) {
        emailError.value = t('form.email_is_required');
    }
    if (!data.value.phone) {
        phoneError.value = t('form.your_phone_number_is_required');
    }
    if (!data.value.message) {
        messageError.value = t('form.your_message_is_required');
    }
    return !nameError.value && !emailError.value && !phoneError.value && !messageError.value;
};

const sendMessage = async () => {
    if (!validateForm()) {
        return;
    }
    loading.value = true;
    try {
        await store.submitForm(data.value);
        triggerToast({
            title: t('toast.great'),
            message: t('toast.your_message_sent_successfully'),
            type: 'success',
            icon: 'fa-solid fa-circle-check',
        });
    } catch (error) {
        // console.log(error)
    } finally {
        loading.value = false;
    }
};

useHead({
    titleTemplate: () => t("head.contact_us"),
});
</script>
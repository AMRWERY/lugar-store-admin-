<template>
  <div>
    <div class="max-w-screen-xl px-4 py-16 mx-auto mt-20 sm:px-6 lg:px-8">
      <div class="max-w-md p-6 mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
        <img src="@/assets/Lugar_Furniture_Logo.svg" class="mx-auto -mt-12 w-36 h-36" />
        <h1 class="text-2xl font-bold text-center text-black sm:text-3xl">
          {{ $t('form.get_started_today') }}
        </h1>
        <p class="text-lg font-medium text-center">{{ $t('form.sign_in_to_your_account') }}</p>

        <form class="space-y-6" @submit.prevent="signIn">
          <div>
            <label for="email" class="block font-medium text-gray-900 text-sm/6">{{ $t('form.email') }}</label>
            <div class="mt-1">
              <input type="email" name="email" id="email" autocomplete="email"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                v-model="data.email" />
            </div>
            <p v-if="emailError" class="mt-1 text-sm font-semibold text-red-500">{{ emailError }}</p>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block font-medium text-gray-900 text-sm/6">{{ $t('form.password') }}</label>
            </div>
            <div class="relative mt-1">
              <input :type="showPassword ? 'text' : 'password'" name="password" id="password"
                autocomplete="current-password"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pe-10"
                v-model="data.password" />
              <button type="button" class="absolute inset-y-0 flex items-center text-gray-500 end-3 hover:text-gray-700"
                @click="togglePassword">
                <i v-if="showPassword" class="fa-solid fa-eye"></i>
                <i v-else class="fa-solid fa-eye-slash"></i>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm font-semibold text-red-500">{{ passwordError }}</p>
          </div>

          <div class="mt-6">
            <button type="submit" :disabled="loading" class="block w-full px-4 py-2 btn-style">
              <div class="flex items-center justify-center" v-if="loading">
                <span class="text-center me-2">{{ $t('loading_btn.logging') }}...</span>
                <i class="fa-solid fa-spinner fa-spin-pulse"></i>
              </div>
              <span v-else>{{ $t('form.login') }}</span>
            </button>

          </div>
          <div v-if="errorMessage" class="mt-2 text-sm text-center text-red-500">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const loading = ref(false);
const errorMessage = ref('');
const { t } = useI18n()

const data = ref({
  email: '',
  password: '',
});

const emailError = ref('');
const passwordError = ref('');

const validateForm = () => {
  emailError.value = '';
  passwordError.value = '';
  if (!data.value.email) {
    emailError.value = t('form.email_is_required');
  } else if (!data.value.email.endsWith("@lugar.com")) {
    emailError.value = t('form.email_must_end_with_lugar');
  }
  if (!data.value.password) {
    passwordError.value = t('form.password_is_required');
  }
  return !emailError.value && !passwordError.value;
};

const signIn = async () => {
  if (!validateForm()) {
    return;
  }
  loading.value = true;
  try {
    await authStore.loginUser({
      email: data.value.email,
      password: data.value.password,
    });
    setTimeout(() => {
      navigateTo('/products');
    }, 3000);
  } catch (error) {
    errorMessage.value = t('toast.login_failed_please_check_your_information_and_try_again');
  } finally {
    loading.value = false;
  }
};

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

definePageMeta({
  layout: false
});

useHead({
  titleTemplate: () => t("head.login"),
});
</script>
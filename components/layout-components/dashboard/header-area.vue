<template>
  <div>
    <!-- overlay Component -->
    <overlay :visible="localeStore.isOverlayVisible" />

    <header class="sticky top-0 flex w-full bg-white z-999 drop-shadow-1">
      <div class="flex items-center justify-between flex-grow px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
          <!-- Hamburger Toggle BTN -->
          <button class="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
             @click="() => { toggleSidebar() }">
            <span class="relative block h-[1.375rem] w-[1.375rem] cursor-pointer">
              <i class="fa-solid fa-bars"></i>
            </span>
          </button>
        </div>

        <ClientOnly>
          <div class="flex ms-auto">
            <nuxt-link to="" class="font-semibold text-black me-4" role="button" v-if="localeStore.isRTL">
              <span class="[&>svg]:w-5" @click="setLocale('en')">
                En
              </span>
            </nuxt-link>
            <nuxt-link to="" class="font-semibold text-black me-4" role="button" v-else>
              <span class="[&>svg]:w-5" @click="setLocale('ar')">
                العربية
              </span>
            </nuxt-link>

            <nuxt-link to="/login" v-if="!authStore.isAuthenticated" class="text-neutral-600 dark:text-white">{{
              $t('form.login') }}</nuxt-link>
          </div>
        </ClientOnly>
      </div>
    </header>
  </div>
</template>

<script setup>
const { toggleSidebar } = useSidebarStore()
const localeStore = useLocaleStore();
const authStore = useAuthStore()
const { locale } = useI18n();

onMounted(() => {
    locale.value = localeStore.locale;
});

const setLocale = (value) => {
    locale.value = value;
    localeStore.updateLocale(value);
};

computed(() => {
    const storedLocale = localeStore.locale;
    setLocale(storedLocale);
});

onMounted(async () => {
  await authStore.init();
});
</script>
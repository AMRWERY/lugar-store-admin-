<template>
    <div>
        <!-- overlay Component -->
        <overlay :visible="authStore.isOverlayVisible" />

        <aside
            class="fixed top-0 z-50 flex h-screen w-[230px] flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0"
            :class="[
                localeStore.isRTL ? 'right-0' : 'left-0',
                {
                    'translate-x-0': sidebarStore.isSidebarOpen,
                    '-translate-x-full': !sidebarStore.isSidebarOpen && !localeStore.isRTL,
                    'translate-x-full': !sidebarStore.isSidebarOpen && localeStore.isRTL,
                    'lg:translate-x-0': true
                }
            ]" ref="target">

            <!-- SIDEBAR HEADER -->
            <div class="flex items-center justify-between gap-3 px-6 py-[1.375rem] lg:py-6.5">
                <nuxt-link to="">
                    <p class="text-3xl font-semibold text-white capitalize opacity-100 max-h-7">Lugar Store</p>
                </nuxt-link>

                <button class="block lg:hidden" @click="sidebarStore.isSidebarOpen = false">
                    <i class="mt-2 text-white fill-current fa-solid fa-arrow-left"></i>
                </button>
            </div>
            <!-- SIDEBAR HEADER -->

            <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <!-- Sidebar Menu -->
                <nav class="py-4 mt-5 text-white lg:mt-9">
                    <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
                        <div>
                            <ul class="mb-6 flex flex-col gap-1.5">
                                <sidebar-item v-for="(menuItem, index) in menuGroup.menuItems" :item="menuItem"
                                    :key="index" :index="index" />
                            </ul>
                        </div>
                    </template>
                </nav>
                <!-- Sidebar Menu -->
            </div>
            <div class="px-3 pb-6 mt-auto">
                <nuxt-link type="button" to="/login" @click="logout"
                    class="block py-2 text-center text-white transition-all duration-300 bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-black">
                    {{ $t('btn.logout') }}
                </nuxt-link>
            </div>
        </aside>
    </div>
</template>

<script setup>
const sidebarStore = useSidebarStore()
const localeStore = useLocaleStore()
const authStore = useAuthStore()
const route = useRoute()
const target = ref(null)

onClickOutside(target, () => {
    sidebarStore.isSidebarOpen = false
})

watch(() => route.path, () => {
    if (sidebarStore.isSidebarOpen) {
        sidebarStore.isSidebarOpen = false
    }
})

const logout = async () => {
    try {
        await authStore.logoutUser();
    } catch (err) {
        console.error('Error during logout:', err);
    }
};

const isLargeScreen = useMediaQuery('(min-width: 1024px)')

watch(isLargeScreen, (isLarge) => {
    if (isLarge) {
        sidebarStore.isSidebarOpen = true
    } else {
        sidebarStore.isSidebarOpen = false
    }
})

const { t } = useI18n()

const menuGroups = computed(() => [
    {
        menuItems: [
            {
                icon: 'fa-solid fa-list',
                label: t('layout.products'),
                route: '/products',
            },
            {
                icon: 'fa-solid fa-layer-group',
                label: t('layout.categories'),
                route: '/categories',
            },
            {
                icon: 'fa-solid fa-icons',
                label: t('layout.marketing_categories'),
                route: '/marketing-categories',
            },
            {
                icon: 'fa-solid fa-bag-shopping',
                label: t('layout.orders'),
                route: '/orders',
            },
            {
                icon: 'fa-solid fa-envelope',
                label: t('layout.customer_messages'),
                route: '/customer-messages',
            },
            {
                icon: 'fa-solid fa-image',
                label: t('layout.banners'),
                route: '/banners',
            },
        ],
    },
]);
</script>
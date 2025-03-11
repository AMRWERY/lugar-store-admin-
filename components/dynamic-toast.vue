<template>
    <div>
        <transition name="toast-slide">
            <div v-if="visible" :class="`relative w-full max-w-lg p-5 rounded-lg shadow sm:max-w-lg ${toastStyles}`">
                <button @click="closeToast" class="absolute mt-2 text-gray-500 top-2 end-2 hover:text-gray-700">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="flex items-start">
                    <div>
                        <i :class="['toastIcon', iconColor]"></i>
                    </div>
                    <div class="ms-3">
                        <h2 class="font-semibold" :class="titleColor">{{ title }}</h2>
                        <p class="mt-2 text-sm leading-relaxed text-gray-600">
                            {{ message }}
                        </p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
    toastIcon: {
        type: String,
        default: '',
    },
    toastType: {
        type: String,
        default: '',
    },
    duration: {
        type: Number,
        default: 5000,
    },
});

const visible = ref(true);
const emit = defineEmits(['toastClosed']);

const toastStyles = computed(() => {
    switch (props.toastType) {
        case 'success':
            return 'bg-green-100 text-green-700';
        case 'error':
            return 'bg-red-100 text-red-700';
        case 'warning':
            return 'bg-yellow-200 text-yellow-700';
        default:
            return 'bg-blue-100 text-blue-700';
    }
});

const iconColor = computed(() => {
    switch (props.toastType) {
        case 'success':
            return 'text-green-500';
        case 'error':
            return 'text-red-500';
        case 'warning':
            return 'text-yellow-500';
        default:
            return 'text-blue-500';
    }
});

const titleColor = computed(() => {
    switch (props.toastType) {
        case 'success':
        case 'error':
        case 'warning':
            return 'text-gray-800';
        default:
            return 'text-blue-800';
    }
});

const closeToast = () => {
    visible.value = false;
    emit('toastClosed');
};

setTimeout(() => {
    closeToast();
}, props.duration);
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.toast-slide-enter,
.toast-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
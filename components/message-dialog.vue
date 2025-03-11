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
                class="w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div class="mt-2">
                  <div v-if="messages?.length" class="flex space-x-6">
                    <!-- Customer Info Section -->
                    <div class="flex-1 p-6 rounded-lg shadow-md bg-gray-50">
                      <h3 class="mb-4 text-xl font-semibold text-gray-900">
                        {{ message.name }} {{ $t('dashboard.s_information') }}
                      </h3>
                      <div class="space-y-3">
                        <p class="text-sm text-gray-700">
                          <span class="font-semibold">{{ $t('dashboard.email') }}:</span>
                          {{ message.email }}
                        </p>
                        <p class="text-sm text-gray-700">
                          <span class="font-semibold">{{ $t('dashboard.phone_number') }}:</span>
                          {{ message.phone }}
                        </p>
                      </div>
                    </div>

                    <!-- Customer message Section with Hidden Scroll -->
                    <div class="flex-1 p-6 bg-gray-100 rounded-lg shadow-md">
                      <h3 class="mb-4 text-xl font-semibold text-gray-900">
                        {{ $t('head.customer_messages') }}
                      </h3>
                      <div class="space-y-4 overflow-y-auto max-h-96 custom-scroll">
                        <div class="flex-1">
                          <p class="text-base font-normal text-gray-900">
                            {{ message.message }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Close Button -->
                  <div class="flex justify-end mt-6">
                    <button class="px-6 py-2.5 btn-style" @click="closeDialog">
                      {{ $t('btn.close') }}
                    </button>
                  </div>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </div>
</template>

<script setup>
const props = defineProps({
  message: Object,
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const store = useContactStore();
const messages = computed(() => store?.messages || []);

const closeDialog = () => {
  emit('close');
};
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
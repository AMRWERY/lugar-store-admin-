<template>
  <div>
    <div v-if="loading" class="animate-pulse">
      <div class="w-3/4 h-4 mb-2 bg-gray-600 rounded"></div>
      <div class="w-1/2 h-4 bg-gray-600 rounded"></div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const emit = defineEmits(["loaded"]);

const simulateLoading = () => {
  setTimeout(() => {
    loading.value = false;
    emit("loaded");
  }, 5000);
};

onMounted(simulateLoading);
</script>
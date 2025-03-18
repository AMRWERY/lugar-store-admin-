<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="inline-flex text-sm -space-s-px">
        <!-- Previous Button -->
        <li>
          <button :disabled="currentPage === 1" @click.prevent="changePage(currentPage - 1)"
            class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 cursor-pointer ms-0 border-e-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            {{ $t('pagination.previous') }}
          </button>
        </li>

        <!-- Page Numbers -->
        <li v-for="pageNumber in visiblePages" :key="pageNumber" @click.prevent="changePage(pageNumber)">
          <button :class="{
            'bg-gray-100 text-gray-700': currentPage === pageNumber,
            'text-gray-500 bg-white': currentPage !== pageNumber,
          }"
            class="flex items-center justify-center h-8 px-3 leading-tight border border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            {{ pageNumber }}
          </button>
        </li>

        <!-- Next Button -->
        <li>
          <button :disabled="currentPage === totalPages" @click.prevent="changePage(currentPage + 1)"
            class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 cursor-pointer rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            {{ $t('pagination.next') }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['page-changed']);

const changePage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= props.totalPages) {
    emit('page-changed', pageNumber);
  }
};

const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  if (props.totalPages <= maxVisiblePages) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }
  let start = Math.max(props.currentPage - 2, 1);
  let end = Math.min(start + maxVisiblePages - 1, props.totalPages);
  if (end - start < maxVisiblePages - 1) {
    start = Math.max(end - maxVisiblePages + 1, 1);
  }
  if (start > 1) pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < props.totalPages - 1) pages.push('...');
  if (end < props.totalPages) pages.push(props.totalPages);

  return pages;
});
</script>
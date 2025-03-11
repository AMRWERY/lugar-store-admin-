<template>
  <div>
    <ul class="mt-4 mb-[1.375rem] flex flex-col gap-2.5 ps-6">
      <template v-for="(childItem, index) in items" :key="index">
        <li>
          <nuxt-link to="" @click="handleItemClick(index)"
            class="group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white"
            :class="{
              '!text-white': childItem.label === sidebarStore.selected
            }">
            {{ childItem.label }}
          </nuxt-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
const sidebarStore = useSidebarStore()

const props = defineProps(['items', 'page'])
const items = ref(props.items)

const handleItemClick = (index) => {
  const pageName =
    sidebarStore.selected === props.items[index].label ? '' : props.items[index].label
  sidebarStore.selected = pageName
}
</script>
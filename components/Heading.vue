<script setup>
const { label } = defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="font-bold text-xl my-4">
    {{ label }}
  </div>
</template>

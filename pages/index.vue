<script setup lang="ts">
const model = ref(null);
</script>

<template>
  <div class="flex flex-1">
    <ClientOnly>
      <chat :model="model" />
    </ClientOnly>
  </div>
</template>
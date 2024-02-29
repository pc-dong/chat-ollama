<script setup lang="ts">
const model = ref(null as string | null);
const onModelChanged = (newModel: string) => {
  model.value = newModel;
  console.log("Model: ", model.value);
}
</script>

<template>
  <div class="flex flex-col w-full">
    <ClientOnly>
      <models @model-changed="onModelChanged" />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { Ollama } from "ollama";
import { loadOllamaHost } from "../utils/settings";

const ollama = new Ollama({ host: loadOllamaHost() });

const emit = defineEmits(["modelSelected"]);

const models = ref([] as any);
const selectedModel = ref(null as string | null);

const label = computed(() => (selectedModel?.value ? selectedModel?.value : "Models"));

onMounted(async () => {
  const response = await ollama.list();
  models.value = [
    response.models.map((m: any) => {
      return {
        label: m.name,
        click: () => {
          console.log("Model selected: ", m.name);
          selectedModel.value = m.name;
          emit("modelSelected", m.name);
        },
      };
    }),
  ];
});
</script>
<template>
  <ClientOnly>
    <UDropdown :items="models" :popper="{ placement: 'bottom-start' }">
      <UButton
        color="white"
        :label="label"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdown>
  </ClientOnly>
</template>

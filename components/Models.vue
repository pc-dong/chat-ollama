<script setup lang="ts">
import { loadOllamaHost } from '~/utils/settings'
import { Ollama, type ModelResponse } from 'ollama';

const ollama = new Ollama({ host: loadOllamaHost() });

const emit = defineEmits(["modelChanged"])

const loadModels = async () : Promise<ModelResponse[]> => {
  const { models } = await ollama.list();
  return models;
};

const models = ref([] as ModelResponse[]);
const modelRows = computed(() => {
  return models.value.map((model: any) => {
    return {
      name: model.name,
      size: model.size,
      family: model.details?.family,
      format: model.details?.format,
      parameter_size: model.details?.parameter_size,
      quantization_level: model.details?.quantization_level
    }
  });
});
const columns = [{
  key: 'name',
  label: 'Name'
}, {
  key: 'size',
  label: 'Size'
}, {
  key: 'family',
  label: 'Family'
}, {
  key: 'format',
  label: 'Format'
}, {
  key: 'parameter_size',
  label: 'Parameter Size'
},
{
  key: 'quantization_level',
  label: 'Quantization Level'
}];

const selectedRows = ref([] as any[]);
const select = (row: any) => {
  const index = selectedRows.value.findIndex((item: any) => item.name === row["name"])
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }

  console.log('Selected rows: ', selectedRows.value);
};

const actions = [
  [{
    key: 'delete',
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: async () => {
      console.log('Deleting models: ', selectedRows.value);
      isOpen.value = true;
    }
  }]
];

const selectedModelName = ref(null as string | null);

loadModels().then((data: ModelResponse[]) => {
  models.value = data;
  selectedModelName.value = data[0]?.name;
  onModelChange();
});

// const modelOptions = computed(() => {
//   return models.value.map((model: any) => model.name);
// });

const onModelChange = () => {
  emit("modelChanged", selectedModelName.value);
};

const onModelDownloaded = () => {
  loadModels().then((data) => {
    models.value = data;
  });
};

// Modal
const isOpen = ref(false);
const onDeleteModel = async () => {
  resetModal();
  selectedRows.value.forEach(async (item: any) => {
    const name = item.name;
    console.log('Deleting model: ', name)
    const status = await ollama.delete({ model: name })
    console.log('Status: ', status);

    if (status?.status === 'success') {
      models.value = models.value.filter((m: any) => m.name !== name);
    }
  });
};

const onCancel = () => {
  resetModal();
};

const resetModal = () => {
  isOpen.value = false;
};
</script>

<template>
  <div>
    <div class="my-8">
      <Download @model-downloaded="onModelDownloaded" />
    </div>
    <UDropdown v-if="selectedRows.length > 0" :items="actions" :ui="{ width: 'w-36' }">
      <UButton icon="i-heroicons-chevron-down" trailing color="gray" size="xs">
        Operations
      </UButton>
    </UDropdown>

    <ClientOnly>
      <UTable
        v-model="selectedRows"
        :columns="columns"
        :rows="modelRows"
        @select="select"
      />
    </ClientOnly>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <span class="font-bold text-lg">Warning</span>
        </template>

        <div>
          <p class="mb-4">
            Are you ok to delete the following model{{
              selectedRows.length > 1 ? "s" : ""
            }}?
          </p>
          <ul>
            <li v-for="row in selectedRows" :key="row.name" class="font-bold">
              {{ row.name }}
            </li>
          </ul>
        </div>

        <template #footer>
          <div class="flex flex-row gap-4">
            <UButton
              class="w-[80px] justify-center"
              color="primary"
              variant="solid"
              @click="onDeleteModel"
            >
              Ok
            </UButton>
            <UButton
              class="w-[80px] justify-center"
              color="white"
              variant="solid"
              @click="onCancel"
            >
              Cancel
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

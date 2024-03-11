<script setup lang="ts">
const state = reactive({
  name: '',
  description: '',
  embedding: '',
  files: [] as File[]
})


const knowledgeBases = reactive([] as any[])
const selected = ref(knowledgeBases[0] || 'chose a knowledge base')
const knowledgeBase = ref("" as string)
const addKnowledgeBase = async () => {
  // knowledgeBases.push(knowledgeBase.value)
  // knowledgeBase.value = ''
  // selected.value = knowledgeBases[knowledgeBases.length - 1]
  // alert(JSON.stringify(state))
  // alert(JSON.stringify(state.files[0].name))
  try {
    const formData = new FormData()
    formData.append('name', state.name)
    formData.append('description', state.description)
    formData.append('embedding', state.embedding)
    state.files.forEach((file) => {
      formData.append('files', file, file.name)
    })
   const response = await $fetch('/api/knowledge-bases', {
      method: 'POST',
      body: formData
    })

    await loadKnowledgeBases()
  } catch (e) {
    console.log(e)
  }
}

const loadKnowledgeBases = async () => {
  try {
    const response = await $fetch('/api/knowledge-bases')
    knowledgeBases.splice(0, knowledgeBases.length)
    knowledgeBases.push(...response)
  } catch (e) {
    console.log(e)
  }
}

onMounted( () => {
  loadKnowledgeBases()
})


const addDocument = () => {
  console.log('Adding document')
}

const onFileChange = (event: Event) =>  {
  const _files = (event.target as HTMLInputElement).files as FileList
  state.files = _files ? Array.from(_files) : []
}

const columns = [{
  key: 'id',
  label: 'ID'
}, {
  key: 'name',
  label: 'Name'
}, {
  key: 'description',
  label: 'Description'
}, {
  key: 'embedding',
  label: 'Embedding'
}, {
  key: 'files',
  label: 'Files'
}]
</script>

<template>
  <div class="flex flex-row w-full">
    <UCard class="flex flex-col w-1/3">
      <template #header>
        <h2 class="text-lg font-semibold">Add Knowledge Base</h2>
      </template>
      <UForm :state="state" @submit="addKnowledgeBase">
        <UFormGroup label="Knowledge Base" name="name">
          <UInput v-model="state.name" placeholder="Enter a knowledge base name"/>
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UInput v-model="state.description" placeholder="Enter description"/>
        </UFormGroup>
        <UFormGroup label="Embedding" name="embedding">
          <UInput v-model="state.embedding" placeholder="Enter embedding"/>
        </UFormGroup>
        <UFormGroup label="Files" name="files">
          <UInput type="file" multiple @change="onFileChange"/>
        </UFormGroup>
        <UButton type="submit">Submit</UButton>
      </UForm>
    </UCard>
    <UCard class="flex flex-col w-2/3 ml-5">
      <UTable :columns="columns" :rows="knowledgeBases" ></UTable>
    </UCard>

  </div>
</template>
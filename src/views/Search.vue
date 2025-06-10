<template>
  <div class="flex flex-col flex-1 sm:pb-5">
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Résultats de recherche : {{searchText}}</h1>
      <div v-if="keywords?.length">
        <p>Recherche pour :</p>
        <ul class="list-disc ml-4">
          <li v-for="(kw, index) in keywords" :key="index">{{ kw }}</li>
        </ul>
      </div>
      <div v-else>
        <p>Aucun mot-clé fourni.</p>
      </div>
    </div>
    <DataView
      layout="grid"
      :value="searchStore.results"
      dataKey="id"
      class="flex flex-1 flex-col sm:justify-center mt-5 gap-3 py-5 px-4 rounded-lg shadow-md bg-white"
    >
      <template #grid="slotProps">
        <div class="flex flex-col sm:grid grid-cols-3 gap-4">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="w-full"
          >
            <ResultCard
              :result="item"
              :key="index"
            />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex border items-center justify-center">
          <i class="pi pi-search text-5xl text-gray-400"></i>
          <p class="text-gray-400">Aucun résultat trouvé.</p>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ResultCard from '@/components/ResultCard.vue';
import { DataView } from 'primevue';

const route = useRoute()
const searchStore = useSearchStore();
const keywords = computed(() => {
  const raw = route.query.keywords

  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return [raw]
})
const searchText = computed(() => {
  return keywords.value[0]
})

onMounted(() => {
  searchPartitions(keywords.value as string[])
})

async function searchPartitions(keywords: string[]) {
  await searchStore.fetchResults(keywords);
}
</script>

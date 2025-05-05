<template>
    <form @submit.prevent="handleSearch" class="w-full flex flex-col items-center gap-3">
      <div ref="search-container" class="relative w-[50vw]">
        <InputGroup class="w-full">
          <InputText
            name="search"
            v-model.trim="query"
            type="text"
            placeholder="Rechercher..."
            class="h-16 rounded-xl"
            @focus="showSuggestions = true"
            autoComplete="off"
          />
          <Button
            type="submit"
            icon="pi pi-search"
            label="Rechercher"
          />
        </InputGroup>
        <ul
          v-if="showSuggestions && filteredSuggestions.length"
          class="absolute w-full flex flex-col gap-2 mt-2 bg-white rounded-xl shadow-sm min-h-[2rem] py-5 px-4"
        >
          <li
            v-for="(suggestion, index) in filteredSuggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion._source.title }} de {{ suggestion._source.composer }}
          </li>
        </ul>
      </div>
      <ul class="flex flex-wrap justify-center">
        <li
          v-for="(query, _) in quickQueries"
          :key="_"
        >
          <Chip
            :label="query.label"
            class="m-1 cursor-pointer"
            :class="[{'bg-primary-200 text-white': queryFilters.includes(query.value)}]"
            @click="toggleQueryFilter(query.value)"
          />
        </li>
      </ul>
    </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { useSearchStore } from '../stores/searchStore';
import Button from '@/components/UI/Button.vue';
import { InputGroup, InputText, Chip } from 'primevue';
import { PARTITION_GENDERS } from '@/constants';
import { watchEffect } from 'vue';
import { onBeforeUnmount } from 'vue';
import type { SearchResult } from '@/types/interfaces';
import router, { route, RouteName } from '@/router';

const quickQueries = [
  ...PARTITION_GENDERS,
]

const searchStore = useSearchStore();

const searchRef = useTemplateRef('search-container');
const showSuggestions = ref(false);
const query = ref<string>('');
const debounceTimeout = ref<number | undefined>(undefined);
const queryFilters = ref<string[]>([]);

const filteredSuggestions = computed(() => {
  return searchStore.results
});

const toggleQueryFilter = (query: string) => {
  const index = queryFilters.value.indexOf(query);
  if (index === -1) {
    queryFilters.value.push(query);
  } else {
    queryFilters.value.splice(index, 1);
  }
}

const handleSearch = () => {
  router.push(route(RouteName.Search, {
    query: {
      keywords: [
        query.value,
        ...queryFilters.value
      ]
    }
  }));
}

const onQueryChange = (keywords: string[]) => {
  if (debounceTimeout.value !== undefined) {
    clearTimeout(debounceTimeout.value);
  }

  if (!keywords.length) {
    searchStore.clearResults();
  }

  debounceTimeout.value = setTimeout(() => {
    searchStore.fetchResults([
      query.value,
      ...queryFilters.value
    ]);
  }, 500);
}

const selectSuggestion = (suggestion: SearchResult) => {
  showSuggestions.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchRef.value && !searchRef.value.contains(event.target)) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watchEffect(() => {
  onQueryChange([
    query.value,
    ...queryFilters.value
  ]);
})

</script>

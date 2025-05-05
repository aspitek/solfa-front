import { SYMBOLS } from '@/constants';
import container from '@/container/inversify.config';
import type { IApiService } from '@/services/ApiService';
import type { SearchResult } from '@/types/interfaces';
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    results: [] as SearchResult[],
    _apiService: container.get<IApiService>(SYMBOLS.IApiService),
  }),
  actions: {
    async fetchResults(keywords: string[]) {
        const { results } = await this._apiService.searchPartitions(keywords);
        this.results = results;
    },
    clearResults() {
      this.results = [];
    }
  },
});

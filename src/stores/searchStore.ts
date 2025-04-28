import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    results: [], // Pour stocker les résultats de la recherche
  }),
  actions: {
    // Action pour effectuer une recherche et mettre à jour les résultats
    async fetchResults(query: string) {
      const url = `http://localhost:8080/search?q=${encodeURIComponent(query)}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        this.results = data.results;
        console.log('Résultats de la recherche:', this.results[0]);
      } catch (error) {
        console.error('Erreur de requête:', error);
      }
    },

    // Action pour vider les résultats
    clearResults() {
      this.results = [];
    }
  },
});
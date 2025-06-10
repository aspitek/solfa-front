<template>
  <div class="flex-1 flex flex-col items-center">
    <div class="w-full px-2 sm:px-5 flex flex-col items-center mt-5 justify-between">
      <div class="hidden sm:flex flex-col items-center mb-5">
        <h1 class="text-2xl font-bold text-center mb-4">SOLFA</h1>
        <p class="text-lg text-center mb-4">
          Bienvenue sur SOLFA, la plateforme de partage de partitions musicales.
          <br />
          Recherchez, téléchargez et partagez vos partitions préférées.
          <br />
        </p>
      </div>
      <!-- <Logo /> -->
      <SearchForm @search-results="handleSearchResults"/>
    </div>
  </div>
</template>

<script lang="ts">
import SearchForm from '../components/SearchForm.vue';
import { useSearchStore } from '../stores/searchStore';
import { useAuthStore } from '../stores/authStore';
import ResultCard from '@/components/ResultCard.vue';

interface SearchResult {
  _id: string; // Ajouter _id pour identifier la partition
  _source: {
    title: string;
    composer: string;
    category: string;
    genre: string;
    release_date: string;
    path: string;
    id: string;
  };
}

export default {
  name: 'HomeSearch',
  components: {
    SearchForm,
    ResultCard,
  },
  data() {
    return {
      results: [] as SearchResult[],
    };
  },
  computed: {
    searchResults() {
      const searchStore = useSearchStore();
      return searchStore.results;
    },
  },
  watch: {
    searchResults(newResults) {
      this.results = newResults;
    },
  },
  methods: {
    handleSearchResults(results: SearchResult[]) {
      this.results = results;
    },
    formatDate(dateString: string) {
      if (!dateString || dateString === '0001-01-01T00:00:00Z') {
        return 'Date inconnue';
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    async deletePartition(id: string, index: number) {
      // Demander une confirmation avant de supprimer
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette partition ? Cette action est irréversible.');
      if (!confirmDelete) return;

      try {
        const authStore = useAuthStore(); // Récupérer le store d'authentification

        // Vérifier si l'utilisateur est connecté
        if (!authStore.isLoggedIn) {
          throw new Error('Vous devez être connecté pour supprimer une partition.');
        }

        // Envoyer une requête DELETE au backend
        const deleteUrl = `http://localhost:8080/admin/delete/${id}`; // Ajuster l'URL selon votre API
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`, // Ajouter le token pour l'authentification
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Partition non trouvée.');
          } else if (response.status === 401) {
            throw new Error('Non autorisé. Veuillez vous reconnecter.');
          } else {
            throw new Error('Erreur lors de la suppression de la partition.');
          }
        }

        // Supprimer la partition de la liste des résultats localement
        this.results.splice(index, 1);
        alert('Partition supprimée avec succès !');
      } catch (error: unknown) {
        console.error('Erreur lors de la suppression :', error);
        alert((error as Error).message || 'Impossible de supprimer la partition. Veuillez réessayer plus tard.');
      }
    },
  },
};
</script>

<style scoped>

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 600px;
  transition: top 0.5s ease-in-out;

}

.results-dropdown {
  top: 100%;
  width: 100%;
  max-width: 700px;
  max-height: 70vh;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 500;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  padding: 10px;
}

.home-search.has-results .results-dropdown {
  opacity: 1;
  transform: translateY(0);
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-card {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.result-card:hover {
  background-color: #f0f0f0;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.download-button, .delete-button {
  flex: 1;
  min-width: 120px;
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.download-button {
  background-color: #db4437;
  color: #ffffff;
}

.delete-button {
  background-color: #ff6f61;
  color: #ffffff;
}

@media (max-width: 768px) {
  .content-wrapper {
    top: 8%;
    margin-top: 20%;
  }
  .results-dropdown {
    width: 90vw;
    max-height: 65vh;
  }
  .action-buttons {
    flex-direction: column;
  }
  .download-button, .delete-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    margin-top: 40%;
  }
  .results-dropdown {
    width: 85vw;
  }
}
</style>

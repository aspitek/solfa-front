<template>
  <div class="home-search" :class="{ 'has-results': results.length }">
    <div class="content-wrapper">
      <Logo />
      <SearchForm @search-results="handleSearchResults" />
      <div v-if="results.length" class="results-dropdown">
        <div class="results-container">
          <div class="result-card" v-for="(result, index) in results" :key="index">
            <h3>{{ result._source.title }}</h3>
            <p><strong>Compositeur :</strong> {{ result._source.composer || 'Inconnu' }}</p>
            <p><strong>Catégorie :</strong> {{ result._source.category || 'Non spécifiée' }}</p>
            <p><strong>Genre :</strong> {{ result._source.genre || 'Non spécifié' }}</p>
            <p><strong>Date de sortie :</strong> {{ formatDate(result._source.release_date) }}</p>
            <div class="action-buttons">
              <button @click="downloadPartition(result._source.path, result._source.title)" class="download-button">
                Télécharger
              </button>
              <button @click="deletePartition(result._source.id, index)" class="delete-button">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SearchForm from '../components/SearchForm.vue';
import Logo from '../components/Logo.vue';
import { useSearchStore } from '../stores/searchStore';
import { useAuthStore } from '../stores/authStore'; // Importer le store d'authentification

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
    Logo,
  },
  data() {
    return {
      results: [] as SearchResult[], // Spécifier le type ici
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
    async downloadPartition(path: string, title: string) {
      try {
        const downloadUrl = `http://147.79.114.72:32040/download?path=${encodeURIComponent(path)}`;
        const response = await fetch(downloadUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Fichier non trouvé dans MinIO');
          } else if (response.status === 400) {
            throw new Error('Requête invalide : chemin manquant');
          } else {
            throw new Error('Erreur lors du téléchargement de la partition');
          }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(`Partition ${title} téléchargée avec succès`);
      } catch (error: unknown) {
        console.error('Erreur lors du téléchargement :', error);
        alert((error as Error).message || 'Impossible de télécharger la partition. Veuillez réessayer plus tard.');
      }
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
        const deleteUrl = `http://147.79.114.72:32040/admin/delete/${id}`; // Ajuster l'URL selon votre API
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
.home-search {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  padding: 0;
  box-sizing: border-box;
 
}

.content-wrapper {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 600px;
  transition: top 0.5s ease-in-out;
  
}

.results-dropdown {
  position: absolute;
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

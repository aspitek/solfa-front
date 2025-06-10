<template>
    <div class="bg-white w-full rounded-lg shadow-md px-4 py-5 flex flex-col gap-2">
      <h3 class="uppercase">{{ result._source.title }}</h3>
      <p><strong>Compositeur :</strong> {{ result._source.composer || 'Inconnu' }}</p>
      <p><strong>Catégorie :</strong> {{ result._source.category || 'Non spécifiée' }}</p>
      <p><strong>Genre :</strong> {{ result._source.genre || 'Non spécifié' }}</p>
      <p><strong>Date de sortie :</strong> {{ formattedDate }}</p>
      <div class="flex mt-5 gap-2 justify-center">
        <Button
          :icon="PrimeIcons.DOWNLOAD"
          label="Télécharger"
          @click="downloadPartition(result._source.path, result._source.title)"
        />
        <Button
          v-if="isLoggedIn && user?.is_admin"
          :icon="PrimeIcons.TRASH"
          @click="deletePartition(result._source.id)"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from './UI/Button.vue';
import { PrimeIcons } from '@primevue/core/api';
import { useAuthStore } from '../stores/authStore';
import { storeToRefs } from 'pinia';
import type { SearchResult } from '@/types/interfaces';


const {result} = defineProps<{result: SearchResult}>();

const authStore = useAuthStore();
const { isLoggedIn, user } = storeToRefs(authStore);


const  formatDate =(dateString: string) => {
  if (!dateString || dateString === '0001-01-01T00:00:00Z') {
    return 'Date inconnue';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const formattedDate = ref(formatDate(result._source.release_date));

const downloadPartition = async (path: string, title: string) => {
  try {
    const downloadUrl = `http://localhost:8080/download?path=${encodeURIComponent(path)}`;
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
};

const deletePartition = async (id: string, index: number = 0) => {
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
}

</script>

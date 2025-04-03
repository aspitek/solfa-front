<!-- src/views/UploadPartition.vue -->
<template>
    <div class="upload-container">
      <h1 class="upload-title">Ajouter une Partition 🎶</h1>
      <p class="upload-subtitle">Partagez vos partitions préférées avec la communauté Solfa !</p>
  
      <form @submit.prevent="handleUpload" class="upload-form">
        <!-- Champ pour le fichier de partition -->
        <div class="form-group">
          <label for="partition_file">Choisir une partition (PDF)</label>
          <input
            type="file"
            id="partition_file"
            accept=".pdf"
            @change="handleFileChange"
            required
          />
        </div>
  
        <!-- Champ pour le titre -->
        <div class="form-group">
          <label for="title">Titre</label>
          <input
            type="text"
            id="title"
            v-model="title"
            placeholder="Entrez le titre de la partition"
            required
          />
        </div>
  
        <!-- Champ pour le compositeur -->
        <div class="form-group">
          <label for="composer">Compositeur</label>
          <input
            type="text"
            id="composer"
            v-model="composer"
            placeholder="Entrez le nom du compositeur"
            required
          />
        </div>
  
        <!-- Champ pour le genre -->
        <div class="form-group">
          <label for="genre">Genre</label>
          <select id="genre" v-model="genre" required>
            <option value="" disabled>Choisissez un genre</option>
            <option value="Classique">Classique</option>
            <option value="Liturgique">Liturgique</option>
            <option value="Recueil de chant">Jazz</option>
            <option value="Animation | 4/4">Pop</option>
            <option value="Gbegbe">Rock</option>
            <option value="Apkongbô">Folk</option>
            <option value="Gospel">Gospel</option>
            <option value="6/8">6/8</option>
            <option value="Traditionnel">Traditionnel</option>
            <option value="Hymne">Hymne</option>
            <option value="Highlife">Highlife</option>
            <option value="Agbadja">Agbadja</option>
            <option value="Abodan">Abodan</option>
            <option value="6/8 Ghana">6/8 Ghana</option>
            <option value="Mandingue">Mandingue</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
  
        <!-- Champ pour la catégorie -->
        <div class="form-group">
          <label for="category">Catégorie</label>
          <select id="category" v-model="category" required>
            <option value="" disabled>Choisissez une catégorie</option>
            <option value="Offertoire">Offertoire</option>
            <option value="Ordinaire">Ordinaire</option>
            <option value="PU">PU</option>
            <option value="Action de grâce">Action de grâce</option>
            <option value="Antienne d'ouverture">Antienne d'ouverture</option>
            <option value="Communion | Sainte Cène">Communion | Sainte Cène</option>
            <option value="Psaume">Psaume</option>
            <option value="Méditation">Méditation</option>
            <option value="Animation">Animation</option>
            <option value="Quête">Quête</option>
            <option value="Acclamation">Acclamation</option>
            <option value="Requiem">Requiem</option>
            <option value="Sacrement">Sacrement</option>
            <option value="Carême">Carême</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
  
        <!-- Champ pour la date de sortie -->
        <div class="form-group">
          <label for="releaseDate">Date de sortie</label>
          <input
            type="date"
            id="releaseDate"
            v-model="releaseDate"
          />
        </div>
  
        <!-- Bouton de soumission -->
        <button type="submit" class="upload-button">Uploader la Partition</button>
      </form>
  
      <!-- Message de succès ou d'erreur -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script lang="ts">
// Le script reste inchangé
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

export default defineComponent({
    name: 'Upload',
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();

      if (!authStore.isLoggedIn) {
        router.push('/login');
      }

      const partitionFile = ref<File | null>(null);
      const title = ref<string>('');
      const composer = ref<string>('');
      const genre = ref<string>('');
      const category = ref<string>('');
      const releaseDate = ref<string>('');
      const successMessage = ref<string>('');
      const errorMessage = ref<string>('');

      const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          partitionFile.value = target.files[0];
        }
      };

      const handleUpload = async () => {
        if (!partitionFile.value) {
          errorMessage.value = 'Veuillez sélectionner un fichier PDF.';
          return;
        }

        const formData = new FormData();
        formData.append('partition_file', partitionFile.value);
        formData.append('Title', title.value);
        formData.append('Composer', composer.value);
        formData.append('Genre', genre.value);
        formData.append('Category', category.value);
        formData.append('ReleaseDate', releaseDate.value);

        try {
          const response = await axios.post('http://147.79.114.72:32040/admin/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authStore.token}`,
            },
          });

          successMessage.value = 'Partition uploadée avec succès !';
          errorMessage.value = '';
          partitionFile.value = null;
          title.value = '';
          composer.value = '';
          genre.value = '';
          category.value = '';
          releaseDate.value = '';
          setTimeout(() => router.push('/partitions'), 2000);
        } catch (error) {
          errorMessage.value = 'Erreur lors de l\'upload de la partition. Vérifiez les champs et réessayez.';
          successMessage.value = '';
          console.error('Erreur lors de l\'upload :', error);
        }
      };

      return {
        partitionFile,
        title,
        composer,
        genre,
        category,
        releaseDate,
        successMessage,
        errorMessage,
        handleFileChange,
        handleUpload,
      };
    },
});
</script>

<style scoped>
.upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh; /* Hauteur minimale */
    background-color: #f5f5f5;
    padding: 1rem; /* Réduit pour mobile */
    overflow-y: auto; /* Active le défilement vertical */
    margin-top: 60px; /* Espace pour la barre de navigation fixe */
}

.upload-title {
    color: #C4827A;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.upload-subtitle {
    color: #A7B5A3;
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.upload-form {
    background-color: white;
    padding: 1.5rem; /* Réduit pour gagner de l'espace */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    text-align: center;
}

.form-group {
    margin-bottom: 1rem; /* Réduit pour compacter */
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 0.3rem; /* Réduit */
    color: #A7B5A3;
    font-family: Arial, sans-serif;
    font-weight: bold;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.5rem; /* Réduit pour compacter */
    border: 2px solid #F9C5B5;
    border-radius: 5px;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #C4827A;
}

.upload-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #A7B5A3;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.upload-button:hover {
    background-color: #C4827A;
}

.success-message {
    color: #A7B5A3;
    margin-top: 1rem;
    font-family: Arial, sans-serif;
}

.error-message {
    color: #C4827A;
    margin-top: 1rem;
    font-family: Arial, sans-serif;
}

/* Media Queries pour petits écrans */
@media (max-width: 600px) {
    .upload-container {
        padding: 0.5rem;
    }

    .upload-form {
        padding: 1rem;
        max-width: 95%; /* Utilise presque toute la largeur */
    }

    .upload-title {
        font-size: 1.5rem;
    }

    .upload-subtitle {
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .form-group input,
    .form-group select {
        padding: 0.4rem;
        font-size: 0.9rem;
    }

    .upload-button {
        padding: 0.6rem;
        font-size: 0.9rem;
    }
}

@media (max-width: 400px) {
    .upload-title {
        font-size: 1.25rem;
    }

    .upload-subtitle {
        font-size: 0.85rem;
    }

    .upload-form {
        padding: 0.75rem;
    }

    .upload-container{
        margin-top: 10%;
    }
}
</style>
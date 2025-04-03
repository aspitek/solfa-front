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
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/authStore';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'Upload',
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
  
      // Vérifier si l'utilisateur est connecté, sinon rediriger vers /login
      if (!authStore.isLoggedIn) {
        router.push('/login');
      }
  
      // Variables réactives pour les champs du formulaire
      const partitionFile = ref<File | null>(null);
      const title = ref<string>('');
      const composer = ref<string>('');
      const genre = ref<string>('');
      const category = ref<string>('');
      const releaseDate = ref<string>('');
      const successMessage = ref<string>('');
      const errorMessage = ref<string>('');
  
      // Gérer le changement de fichier
      const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          partitionFile.value = target.files[0];
        }
      };
  
      // Gérer l'upload de la partition
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
          const response = await axios.post('http://localhost:8080/admin/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authStore.token}`,
            },
          });
  
          successMessage.value = 'Partition uploadée avec succès !';
          errorMessage.value = '';
          // Réinitialiser le formulaire
          partitionFile.value = null;
          title.value = '';
          composer.value = '';
          genre.value = '';
          category.value = '';
          releaseDate.value = '';
          // Rediriger vers une page de liste des partitions (à créer)
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
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
    padding-bottom: 25%;
  }
  
  .upload-title {
    color: #C4827A; /* Rose saumon */
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .upload-subtitle {
    color: #A7B5A3; /* Vert pâle */
    font-family: Arial, sans-serif;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .upload-form {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #A7B5A3; /* Vert pâle */
    font-family: Arial, sans-serif;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #F9C5B5; /* Pêche clair */
    border-radius: 5px;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #C4827A; /* Rose saumon */
  }
  
  .upload-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #A7B5A3; /* Vert pâle */
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
    background-color: #C4827A; /* Rose saumon */
  }
  
  .success-message {
    color: #A7B5A3; /* Vert pâle */
    margin-top: 1rem;
    font-family: Arial, sans-serif;
  }
  
  .error-message {
    color: #C4827A; /* Rose saumon */
    margin-top: 1rem;
    font-family: Arial, sans-serif;
  }
  
  @media (max-width: 600px) {
    .upload-form {
      padding: 1.5rem;
      max-width: 90%;
    }
  
    .upload-title {
      font-size: 1.5rem;
    }
  
    .upload-subtitle {
      font-size: 1rem;
    }
  }
  </style>
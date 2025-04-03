<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar">
        <div class="navbar-brand" @click="goToHome">Solfa</div>
        <div class="navbar-actions">
            <button v-if="!isLoggedIn" @click="goToLogin" class="nav-button login-button">
                Se connecter
            </button>
            <button v-else @click="goToUpload" class="nav-button login-button">
                Menu
            </button>
            <button v-if="isLoggedIn" @click="logout" class="nav-button logout-button">
                Se déconnecter
            </button>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
    name: 'Navbar',
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const { isLoggedIn } = storeToRefs(authStore);

        const goToLogin = () => {
            console.log('Clic sur Se connecter');
            router.push('/login');
        };

        const goToHome = () => {
            console.log('Clic sur Home');
            router.push('/');
        };

        const goToUpload = () => {
            console.log('Clic sur Menu');
            router.push('/upload');
        };

        const logout = () => {
            console.log('Clic sur Se déconnecter');
            authStore.logout();
            router.push('/login');
        };

        return { isLoggedIn, goToLogin, goToHome, goToUpload, logout };
    },
});
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #C4827A;
    color: #ffffff;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: Arial, sans-serif;
    cursor: pointer;
}

.navbar-actions {
    display: flex;
    gap: 1rem;
}

.nav-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    font-weight: bold;
    transition: background-color 0.2s ease, color 0.2s ease;
    min-height: 44px;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-button {
    background-color: #F9C5B5;
    color: #C4827A;
}

.login-button:hover {
    background-color: #A7B5A3;
    color: #ffffff;
}

.logout-button {
    background-color: #ffffff;
    color: #C4827A;
}

.logout-button:hover {
    background-color: #f0f0f0;
    color: #C4827A;
}

/* Media Queries pour téléphones */
@media (max-width: 600px) {
    .navbar {
        padding: 0.5rem 1rem; /* Réduit le padding */
        flex-wrap: nowrap; /* Évite le retour à la ligne */
        justify-content: space-between;
    }

    .navbar-brand {
        font-size: 1.2rem; /* Réduit la taille du logo */
        margin-right: 0.5rem; /* Espace minimal */
    }

    .navbar-actions {
        gap: 0.5rem; /* Réduit l’espace entre les boutons */
        flex-grow: 1; /* Utilise l’espace disponible */
        justify-content: flex-end; /* Aligne les boutons à droite */
    }

    .nav-button {
        padding: 0.3rem 0.6rem; /* Réduit mais reste cliquable */
        font-size: 0.8rem; /* Texte plus petit */
        min-height: 36px; /* Hauteur minimale pour le tactile */
        min-width: 70px; /* Largeur réduite */
    }
}

@media (max-width: 400px) {
    .navbar {
        padding: 0.3rem 0.5rem; /* Encore plus compact */
    }

    .navbar-brand {
        font-size: 1rem; /* Plus petit */
    }

    .navbar-actions {
        gap: 0.3rem; /* Encore moins d’espace */
    }

    .nav-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        min-height: 32px; /* Minimum pour très petits écrans */
        min-width: 60px; /* Plus compact */
    }
}
</style>
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
import { defineComponent, ref, watch } from 'vue';
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
            router.push('/login');
        };

        const goToHome = () => {
            router.push('/');
        };

        const goToUpload = () => {
            router.push('/upload');
        };

        const logout = () => {
            authStore.logout();
            router.push('/login');
        };

        return {
            isLoggedIn, // Utiliser localIsLoggedIn dans le template
            goToLogin,
            goToUpload,
            goToHome,
            logout,
        };
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
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: Arial, sans-serif;
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

@media (max-width: 600px) {
    .navbar {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
    }

    .navbar-actions {
        width: 100%;
        justify-content: center;
    }

    .nav-button {
        width: 100%;
        padding: 0.75rem;
    }
}
</style>
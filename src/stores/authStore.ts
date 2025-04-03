// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios, { AxiosError } from 'axios';
import type { Router } from 'vue-router';

const svr = 'http://localhost:8080'

declare module 'pinia' {
    export interface PiniaCustomProperties {
        $router: Router;
    }
}

// Interface pour les données de login
interface LoginCredentials {
    email: string;
    password: string;
}

// Interface pour l'état du store
interface AuthState {
    token: string | null;
}

export const useAuthStore = defineStore('auth', () => {
    // État
    const token = ref<AuthState['token']>(localStorage.getItem('token') || null);

    // Getters
    const isLoggedIn = computed(() => !!token.value);

    // Actions
    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            // Remplacez cette URL par celle de votre API FastAPI
            const response = await axios.post<{ token: string }>(`${svr}/login`, {
                email: credentials.email,
                password: credentials.password,
            });
            token.value = response.data.token;
            localStorage.setItem('token', token.value);
            return true; // Indique que la connexion a réussi
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Erreur lors de la connexion:', axiosError.message);
            throw new Error('Échec de la connexion. Vérifiez vos identifiants.');
        }
    };

    const logout = () => {
        token.value = null;
        localStorage.removeItem('token');
        // Note : La redirection est gérée dans les composants ou les gardes de navigation
    };

    const checkAuth = async (): Promise<boolean> => {
        if (!token.value) {
            return false;
        }
        try {
            // Vérifier si le token est valide (optionnel, selon votre API)
            await axios.get(`${svr}/certify`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            });
            return true;
        } catch (error) {
            logout(); // Déconnecter si le token est invalide
            return false;
        }
    };

    return { token, isLoggedIn, login, logout, checkAuth };
});

// Ajouter une propriété router au store pour l'utiliser dans les actions
export function setupAuthStoreRouter(router: Router) {
    const authStore = useAuthStore();
    authStore.$router = router;
}
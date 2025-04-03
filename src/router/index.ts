// src/router/index.ts
import { createRouter, createWebHistory} from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import HomeSearch from '../views/HomeView.vue';
import Login from '../views/LoginView.vue';
import Upload from '../views/Upload.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeSearch,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const authStore = useAuthStore();
      if (authStore.isLoggedIn) {
        next('/upload'); // Rediriger vers le tableau de bord si déjà connecté
      } else {
        next();
      }
    },
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation globale pour protéger les routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth();
    if (!isAuthenticated) {
      next('/login'); // Rediriger vers la page de login si non connecté
    } else {
      next(); // Autoriser l'accès si connecté
    }
  } else {
    next(); // Autoriser l'accès pour les routes non protégées (comme /)
  }
});

export default router;
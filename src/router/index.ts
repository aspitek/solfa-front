// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeSearch from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeSearch,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';
import HomeSearch from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Upload from '@/views/Upload.vue';
import { useAuthStore } from '../stores/authStore';
import Register from '@/views/Register.vue';

export enum RouteName {
  Home = 'Home',
  Login = 'Login',
  Register = 'Register',
  Upload = 'Upload',
}

export type RouteParams = {
  [RouteName.Home]: undefined;
  [RouteName.Login]: undefined;
  [RouteName.Register]: undefined;
  [RouteName.Upload]: undefined;
};

const GUEST_ONLY_ROUTES = [
  RouteName.Login,
  RouteName.Register,
];
const AUTH_ONLY_ROUTES = [
  RouteName.Upload,
];

const ADMIN_ONLY_ROUTES = [
  RouteName.Upload,
];
const isGuestRoute = (routeName: RouteName) => GUEST_ONLY_ROUTES.includes(routeName);
const isAuthRoute = (routeName: RouteName) => AUTH_ONLY_ROUTES.includes(routeName);
const isAdminRoute = (routeName: RouteName) => ADMIN_ONLY_ROUTES.includes(routeName);

const isAuth = () => {
  const authStore = useAuthStore();

  return authStore.isLoggedIn;
};
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.Home,
    component: HomeSearch,
  },
  {
    path: '/login',
    name: RouteName.Login,
    component: Login,
  },
  {
    path: '/register',
    name: RouteName.Register,
    component: Register,
  },
  {
    path: '/upload',
    name: RouteName.Upload,
    component: Upload,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const { checkAuth } = useAuthStore();
  await checkAuth()
  if (isGuestRoute(to.name as RouteName) && isAuth()) {
    return next({ name: RouteName.Home });
  }
  if (isAuthRoute(to.name as RouteName) && !isAuth()) {
    return next({ name: RouteName.Login });
  }

  return next();
});

export function route<Name extends RouteName>(
  name: Name,
  params?: RouteParams[Name]
) {
  return router.resolve({ name, params }).href;
}

export default router;

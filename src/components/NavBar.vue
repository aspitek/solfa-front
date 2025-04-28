<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar">
        <div class="text-2xl text-primary cursor-pointer" @click="goToHome">Solfa</div>
        <div class="flex gap-2">
            <Button
              v-if="!isLoggedIn"
              label="Se connecter"
              as="router-link" :to="route(RouteName.Login)"
            />
            <template v-else>
              <Button
                v-if="user?.is_admin"
                label="Ajouter une partition"
                link
                as="router-link"
                :to="route(RouteName.Upload)"
              />
              <Button
                :icon="PrimeIcons.SIGN_OUT"
                iconPos="right"
                @click="logout"
              />
            </template>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { storeToRefs } from 'pinia';
import Button from '@/components/UI/Button.vue';
import { route, RouteName } from '@/router';
import { PrimeIcons } from '@primevue/core/api';

const authStore = useAuthStore();
const router = useRouter();
const { isLoggedIn, user } = storeToRefs(authStore);

const goToLogin = () => {
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

</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    color: #ffffff;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    top: 0;
    left: 0;
    z-index: 1000;
}
</style>

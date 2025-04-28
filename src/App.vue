<!-- src/App.vue -->
<template>
  <div class="flex flex-col flex-1 ">
    <Toast />
    <Navbar/>
    <div class="flex flex-1 lg:px-6 2xl:px-12">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Navbar from './components/NavBar.vue';
import Toast from 'primevue/toast';

localStorage.theme = 'light';

</script>
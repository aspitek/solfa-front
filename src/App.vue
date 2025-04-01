<!-- src/App.vue -->
<template>
  <div class="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import Navbar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style>
/* Réinitialisation globale pour éviter les marges et barres de défilement */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.app {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
</style>
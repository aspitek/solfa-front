<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar">
      <div class="navbar-brand">Solfa</div>
      <div class="navbar-actions">
        <button v-if="!isLoggedIn" @click="login" class="nav-button">Se connecter</button>
        <button v-else @click="logout" class="nav-button">Se déconnecter</button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    data() {
      return {
        isLoggedIn: false, // Simule l'état de connexion (à remplacer par une vraie logique d'authentification)
      };
    },
    methods: {
      login() {
        this.isLoggedIn = true;
        console.log('Utilisateur connecté');
      },
      logout() {
        this.isLoggedIn = false;
        console.log('Utilisateur déconnecté');
      },
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #C4827A; /* Rouge */
    color: #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
  
  .navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .navbar-actions {
    display: flex;
    gap: 1rem;
  }
  
  .nav-button {
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #C4827A;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .nav-button:hover {
    background-color: #f0f0f0;
  }
  </style>
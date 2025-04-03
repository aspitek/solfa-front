<!-- src/components/Login.vue -->
<template>
    <div class="login-container">
      <!-- Logo -->
      <div class="logo">
        <svg width="400" height="350" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <text x="40" y="100" font-family="Arial" font-size="40" font-weight="bold">
            <tspan x="5" fill="#A7B5A3">S</tspan>
            <tspan x="45" fill="#F9C5B5">O</tspan>
            <tspan x="90" fill="#C4827A">L</tspan>
            <tspan x="125" fill="#A7B5A3">F</tspan>
            <tspan x="160" fill="#F9C5B5">A</tspan>
          </text>
        </svg>
      </div>
  
      <!-- Formulaire de login -->
      <div class="login-form">
        <h2>Connexion</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Entrez votre email" required />
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" v-model="password" placeholder="Entrez votre mot de passe" required />
          </div>
          <button type="submit" class="login-button">Se connecter</button>
        </form>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p class="signup-link">
          Pas de compte ? <b>Veuillez contacter un admin</b>
        </p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useAuthStore } from '../stores/authStore';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'Login',
    setup() {
      const email = ref<string>('');
      const password = ref<string>('');
      const error = ref<string>('');
      const authStore = useAuthStore();
      const router = useRouter();
  
      const handleLogin = async () => {
        try {
          await authStore.login({ email: email.value, password: password.value });
          email.value = '';
          password.value = '';
          error.value = '';
          router.push('/upload'); // Redirection après connexion réussie
        } catch (err) {
          error.value = (err as Error).message || 'Erreur lors de la connexion.';
        }
      };
  
      return {
        email,
        password,
        error,
        handleLogin,
      };
    },
  });
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
  }
  
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    margin-bottom: 2rem;
  }
  
  .login-form {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  .login-form h2 {
    color: #C4827A;
    margin-bottom: 1.5rem;
    font-family: Arial, sans-serif;
    font-weight: bold;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #A7B5A3;
    font-family: Arial, sans-serif;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #F9C5B5;
    border-radius: 5px;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #C4827A;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #A7B5A3;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .login-button:hover {
    background-color: #C4827A;
  }
  
  .error-message {
    color: #C4827A;
    margin-top: 1rem;
    font-family: Arial, sans-serif;
  }
  
  .signup-link {
    margin-top: 1rem;
    color: #A7B5A3;
    font-family: Arial, sans-serif;
  }
  
  .signup-link a {
    color: #F9C5B5;
    text-decoration: none;
    font-weight: bold;
  }
  
  .signup-link a:hover {
    color: #C4827A;
  }
  
  @media (max-width: 600px) {
    .login-form {
      padding: 1.5rem;
      max-width: 90%;
    }
  
    .logo {
      height: 80px;
    }
  }
  </style>
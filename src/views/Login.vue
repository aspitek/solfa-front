<template>
    <div class="flex flex-col items-center justify-center flex-1">
      <!-- Formulaire de login -->
      <div class="bg-white w-[80vw] sm:w-[40vw] md:w-[30vw] min-h-[70vh] flex flex-col items-center pt-10 pb-3 px-3 rounded-md shadow-md">
        <div class="h-[20%]">
          <h2 class="text-2xl">Connexion</h2>
        </div>
        <div class="flex-1 flex flex-col justify-between  w-[90%]">
          <Form
            v-slot="{loading}"
            class="flex flex-col items-center"
            :initialValues
            :schema="loginSchema"
            @submit="handleLogin"
          > 
            <Input
              name="email"
              type="email"
              label="Email"
              id="email"
              placeholder="Entrez votre email"
            />
            <Password
              name="password"
              label="Mot de passe"
              placeholder="*********"
            />
            <Button
              class="mt-5"
              label="Se connecter"
              type="submit"
              :loading
              fuild
            />
          </Form>
          <p>
            Pas de compte ? 
            <Button link label="Veuillez contacter un admin"/>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useAuthStore } from '../stores/authStore';
  import { useRouter } from 'vue-router';
  import { loginSchema } from '@/schemas/auth';
  import Form from '@/components/UI/Form.vue';
  import Input from '@/components/UI/Input.vue';
  import Button from '@/components/UI/Button.vue';
  import Password from '@/components/UI/Password.vue';
  import { route, RouteName } from '@/router';

  export default defineComponent({
    name: 'Login',
    components: {
      Form,
      Input,
      Button,
      Password,
    },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const initialValues = ref({
        email: '',
        password: ''
      })

      const handleLogin = async ({email, password}: any) => {
        await authStore.login({ email, password });
        router.push(route(RouteName.Upload));
      };
  
      return {
        initialValues,
        loginSchema,
        handleLogin,
      };
    },
  });
  </script>
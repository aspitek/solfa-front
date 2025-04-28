<template>
  <div class="flex flex-col items-center justify-center flex-1">
    <div class="bg-white w-[80vw] sm:w-[40vw] md:w-[30vw] min-h-[80vh] flex flex-col items-center pt-10 pb-3 px-3 rounded-md shadow-md">
      <div class="h-[20%]">
        <h2 class="text-2xl">Inscription Admin</h2>
      </div>
      <div class="flex-1 flex flex-col justify-between w-[90%]">
        <Form
          v-slot="{loading}"
          class="flex flex-col items-center"
          :initialValues
          :schema="registerSchema"
          @submit="handleRegister"
        > 
          <Input
            name="email"
            type="email"
            label="Email"
            id="email"
            fuild
          />
          <Input
            name="username"
            label="Nom d'utilisateur"
            id="username"
            fuild
          />
          <Password
            name="password"
            label="Mot de passe"
            placeholder="*********"
            fuild
          />
          <Button
            class="mt-5"
            label="Se connecter"
            type="submit"
            :loading
            fuild
          />
        </Form>
        <div class="flex items-center justify-end">
          <span> deja un compte ? </span>
          <Button link as="router-link" :to="route(RouteName.Login)" label="connectez-vous"/>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>

import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { route, RouteName } from '@/router'
import { registerSchema } from '@/schemas/auth';
import Button from '@/components/UI/Button.vue';
import Form from '@/components/UI/Form.vue';
import Input from '@/components/UI/Input.vue';
import Password from '@/components/UI/Password.vue';

const authStore = useAuthStore();
const router = useRouter();

const initialValues = ref({
  email: '',
  password: '',
  username: '',
})

const handleRegister = async ({ email, username, password }: any, form: any) => {
  try {
    await authStore.register({email, username, password});
    router.push(route(RouteName.Upload));// Redirection après connexion réussie
  } finally {
    console.log(form);
  }
};

</script>

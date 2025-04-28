import './assets/styles/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config'

const app = createApp(App)

app
    .use(PrimeVue, {theme: 'none'})
    .use(ToastService)
    .use(createPinia())
    .use(router)
    .mount('#app')

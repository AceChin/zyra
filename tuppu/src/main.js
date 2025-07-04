import './assets/main.css'
import router from './router.js'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './lang'
import * as Pinia from "pinia";
import { piniaLoadingPlug } from './stores/loading'

const pinia = Pinia.createPinia()
pinia.use(piniaLoadingPlug)

document.documentElement.style.fontSize = (document.documentElement.clientWidth / 25) + 'px';

createApp(App).use(router).use(pinia).use(i18n).mount('#app')

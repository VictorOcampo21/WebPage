import { createApp } from 'vue'
import App from './App.vue'
import { reveal } from './reveal.js'
import './style.css'

createApp(App).directive('reveal', reveal).mount('#app')

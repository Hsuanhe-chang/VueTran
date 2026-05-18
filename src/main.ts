// 應用程式入口點：建立 Vue app 並掛載 Pinia、Router
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'

// 全域 CSS（含 Reset 與 CSS 變數）
import './assets/styles/global.css'

const app = createApp(App)

// 先掛載 Pinia（讓 store 在 router guards 中也能使用）
app.use(createPinia())
app.use(router)

app.mount('#app')

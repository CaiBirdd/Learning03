import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/es/notify/style/index.mjs' //vant通知样式生效

const app = createApp(App)

app.use(router)

app.mount('#app')

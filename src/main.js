import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/es/notify/style/index.mjs' //vant通知样式生效

const app = createApp(App)
//导航守卫
router.beforeEach((to, from) => {
  if (to.path !== 'login') {
    if (!localStorage.getItem('h5_token')) {
      return '/login'
    }
  }
})
app.use(router)

app.mount('#app')

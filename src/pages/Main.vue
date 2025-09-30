<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//vant tab 切换
const active = ref(0)
//根据路由信息渲染底部tab
const route = useRoute()
const router = useRouter()
onMounted(()=>{
  console.log(router,'路由信息')
  const routerData = router.options.routes[0].children
  //在 routerData 数组中查找一个元素，该元素的路径与当前页面的路径相匹配。
  active.value =  routerData.findIndex((item)=> '/' + item.path === route.path)

})
//这里的路由跳转，是通过vant的url参数实现的
//点击 Tab → 触发 url 属性的链接跳转 → URL Hash 改变 → Vue Router 监听到变化 → 渲染对应组件到 <RouterView>。
</script>

<template>
  <div>
    <!-- 二级路由出口 -->
    <RouterView></RouterView>
  </div>
  <van-tabbar v-model="active" >
    <van-tabbar-item 
      v-for="item in router.options.routes[0].children"
      :key="item.path"
      :icon="item.meta.icon"
      :url="`#/${item.path}`"
    >
      {{ item.meta.name }}
    </van-tabbar-item>
  </van-tabbar>


</template>

<style scoped>
</style>

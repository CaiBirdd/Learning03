<script setup>
import { ref, onMounted, watch } from 'vue' // 【修改】导入 watch
import { useRoute, useRouter } from 'vue-router'

//vant tab 切换
const active = ref(0)
//根据路由信息渲染底部tab
const route = useRoute()
const router = useRouter()

// 【新增函数】统一处理根据路由路径设置 active 索引的逻辑
const updateActiveTab = (currentRoute) => {
  // 底部 Tab 对应的是一级路由下的 children中的home order和user
  const routerData = router.options.routes[0].children
  // 在 routerData 数组中查找一个元素，该元素的路径与当前页面的路径相匹配。
  active.value = routerData.findIndex((item) => '/' + item.path === currentRoute.path)
}


onMounted(()=>{
  console.log(router,'路由信息')
  updateActiveTab(route) // 【修改】在组件挂载时进行首次设置
})

// 【新增 Watcher】监听路由路径的变化
// 解决用户点击浏览器的“返回”按钮时，组件不重新挂载，但路由已改变，active 状态未更新的问题。
watch(
  () => route.path, // 监听 route 对象的 path 属性
  () => {
    // 路由路径变化时，重新计算 active 状态
    updateActiveTab(route)
  }
)

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

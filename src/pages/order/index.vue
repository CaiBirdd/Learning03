<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOrderPageListAPI } from '@/api'
import counter from '@/components/counter.vue'
const route = useRoute()
const router = useRouter()

//顶部tab栏激活状态和选择刷新操作
// 注意：van-tabs 的 name 属性是字符串，所以 active 应该初始化为字符串
const active = ref('')
const SelectTab = (item)=>{
  //@click-tab时间会将当前点击的tab参数传过来
  //console.log(item,'打印对象')
  getOrderPageList(item.name)
}
//订单页面数据
const orderPageData = ref()
//注意这里后端接口要求传入的是state 增加默认参数，防止第一次加载时 state 为 undefined
const getOrderPageList = async (state = '')=>{
  const res  = await getOrderPageListAPI({state})
  orderPageData.value = res.data.data
  console.log(orderPageData.value,'当前点击类型的订单列表数据')
  //向对象数组中的每一个对象 增加一个剩余时间 用来渲染
  orderPageData.value.forEach((item)=> {
    item.countdown  = item.order_start_time + 7200000 - Date.now()
  })
}
//这里对进入页面默认获取数据渲染列表做了小更改
//因为 我的页面 点击跳转过来会在url上带参数 所以做一下小判定 
//如果路由没带参数，就执行默认的拿整页数据，如果带参数了，根据带的参数传入激活和渲染
onMounted(()=>{
  // 1. 获取 URL 中的 active 查询参数
  const initialActive = route.query.active
  // 2. 如果参数存在，则赋值给 active
  if (initialActive) {
    // 确保 active 是字符串，因为 van-tab 的 name 属性是字符串 ('1', '2', '3', '4')
    active.value = String(initialActive) 
  } else {
    // 如果没有 active 参数，默认激活 '全部' (name='')
    active.value = ''
  }
  // 3. 根据激活的 active 值加载对应的数据
  getOrderPageList(active.value)
  //进入页面获取数据
})
//跳转订单详情页
const goDetailPage = (item)=>{
  router.push(`/detail?oid=${item.out_trade_no}`)
}
//根据不同状态显示不同颜色字样
const statusColor = ref({
  待支付: '#ffa200',
  待服务: '#1da6fd',
  已完成: '#21c521',
})
</script>

<template>
 
  <div class="container">   
    <!-- 顶部 -->
    <van-nav-bar
      title="我的订单"
      left-arrow
      @click-left="router.go(-1)"
    />
    <!-- tab标签栏 -->
    <van-tabs v-model:active="active" @click-tab="SelectTab">
      <van-tab title="全部" name='' />
      <van-tab title="待支付" name="1" />
      <van-tab title="待服务" name="2" />
      <van-tab title="已完成" name="3" />
      <van-tab title="已取消" name="4" />
    </van-tabs>

    <!--订单列表渲染  -->
    <van-row @click="goDetailPage(item)" v-for="item in orderPageData" :key="item.out_trade_no">
      <van-col span="5">
        <van-image width="55" height="55" radius="5" :src="item.serviceImg"/>
      </van-col>
      <van-col span="14">
        <div class="text1">{{ item.service_name }}</div>
        <div class="text2">
          <div>{{ item.hospital_name }}</div>
          <div>预约时间:{{ item.starttime }}</div>
        </div>
      </van-col>
      <!-- 这里还是用的对象的键名和键值进行字体颜色匹配 倒计时直接用一个组件处理了传入剩余时间 在待支付时才显示-->
      <van-col span="5" class="text2" :style="{color:statusColor[item.trade_state]}">
        {{ item.trade_state }}
        <counter :millisecond="item.countdown" v-if="item.trade_state === '待支付'"></counter>
      </van-col>
    </van-row>
    <div class="bottom-text">没有更多了</div>
  </div>
    


</template>

<style scoped lang="less">
.container {
    background-color: #f0f0f0;
    min-height: 100vh; /* 改为最小高度，确保内容少时也能撑开 */
    padding-bottom: 70px; /* 留出 70px 的底部空间，再多一点点 保证不被底部导航栏挡住*/
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
    .header-left {
    text-align: left;
    align-items: center;
  }
  }
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    align-items: center; //图片和文字垂直居中
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>

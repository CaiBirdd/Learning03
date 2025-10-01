<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOrderPageListAPI } from '@/api'
import counter from '@/components/counter.vue'
const route = useRoute()
const router = useRouter()

//顶部tab栏激活状态和选择刷新操作
const active = ref('')
const SelectTab = (item)=>{
  //@click-tab时间会将当前点击的tab参数传过来
  //console.log(item,'打印对象')
  getOrderPageList(item.name)
}
//订单页面数据
const orderPageData = ref()
//注意这里后端接口要求传入的是state
const getOrderPageList = async (state)=>{
  const res  = await getOrderPageListAPI({state})
  orderPageData.value = res.data.data
  console.log(orderPageData.value,'当前点击类型的订单列表数据')
  //向对象数组中的每一个对象 增加一个剩余时间 用来渲染
  orderPageData.value.forEach((item)=> {
    item.countdown  = item.order_start_time + 7200000 - Date.now()
  })
}
onMounted(()=>{
  //进入页面获取数据
  getOrderPageList()
})
//跳转订单详情页
const goDetailPage = ()=>{

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
      title="订单详情"
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
        <counter :second="item.countdown" v-if="item.trade_state === '待支付'"></counter>
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

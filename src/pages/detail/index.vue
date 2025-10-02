<script setup>
import { useRouter, useRoute } from 'vue-router'
import orderStatusBar from '@/components/orderStatusBar.vue'
import { getOrderDetailPageAPI } from '@/api'
import { computed, onMounted, ref } from 'vue'
import Counter from '@/components/counter.vue'
import QRCode from 'qrcode'
const route = useRoute()
const router = useRouter()

//订单详情页数据
const deatilPageData = ref({})
onMounted(async ()=>{
  const res = await getOrderDetailPageAPI({oid:route.query.oid})
  deatilPageData.value = res.data.data
  console.log(deatilPageData.value,'订单详情页数据')
  //二维码数据
  url.value = await QRCode.toDataURL(res.data.data.code_url)
  console.log(url.value,'转换好的二维码src')
})

//进度条状态
const statusBarData = {
  待支付: 10,
  待服务: 20,
  已完成: 30,
  已取消: 40
}
//处理待支付时间 由于这个页面就一个 不同于订单页面  不用数组遍历了 直接计算属性
const countdown = computed(()=> {
  return  deatilPageData.value.order_start_time ? deatilPageData.value.order_start_time + 7200000 - Date.now() : 0
})

//支付二维码弹窗
const showCode = ref(false)
//二维码数据
const url = ref()
//关闭支付二维码弹窗
const closeCode = () => {
  showCode.value = false
}

//对后端返回的数据进行一下处理 方便遍历
//预约信息
const appointmentInformation = ref({
  service_name: '预约服务',
  hospital_name: '就诊医院',
  starttime: '期望就诊时间',
  'client.name': '就诊人',
  'client.mobile': '就诊人电话',
  receiveAddress: '接送地址',
  demand: '其他需求'
})
//订单信息
const orderInformation = ref({
  'client.mobile': '联系电话',
  order_start_time: '下单时间',
  price: '应付金额',
  out_trade_no: '订单编号'
})
//对以上两个信息中的时间进行处理 这个代码是现成的
//总结来说，formatData 函数的作用是：
//遇到 order_start_time 时，进行 日期格式化。
//遇到 client.name 这样的键时，进行 嵌套取值。
//遇到其他普通键时，进行 直接取值。
const formatData = (key) => {
  if (key.indexOf('.') === -1) {
    if (key === 'order_start_time') {
      return formatTimestamp(deatilPageData.value[key])
    }
    return deatilPageData.value[key]
  }
  let arr = key.split('.').reduce((o, p) => {
    return (o || {})[p]
  }, deatilPageData.value)
  return arr
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
  <div class="container">
    <!-- 顶部 -->
    <van-nav-bar
      title="订单详情"
      left-arrow
      @click-left="router.go(-1)"
    />
    <!-- 进度状态条 还是对象的键名和键值-->
    <orderStatusBar :item = "statusBarData[deatilPageData.trade_state]"></orderStatusBar>
    <!-- 订单状态 -->
    <div class="tips">
      <div class="dzf" v-if="deatilPageData.trade_state === '待支付'">
        <div class="text1">订单待支付</div>
        <div class="text2">
          请在<Counter :millisecond="countdown"></Counter>内完成支付,超时订单自动取消
        </div>
        <div class="text3">
          <van-button @click="showCode = true" type="success" size="large">
            立即支付(0.1元)
          </van-button>
        </div>
      </div>
      <div class="dzf" v-if="deatilPageData.trade_state === '待服务'">
        <div class="text1">正在为您安排服务专员...</div>
        <div class="text2">请保持手机畅通，稍后将有服务专员与您联系</div>
      </div>
      <div class="dzf" v-if="deatilPageData.trade_state === '已完成'">
        <div class="text1">服务已完成</div>
        <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
      </div>
      <div class="dzf" v-if="deatilPageData.trade_state === '已取消'">
        <div class="text1">订单已取消</div>
        <div class="text2">期待下次为您服务，如需帮助可咨询客服</div>
      </div>
    </div>
    <!-- 二维码支付弹窗 联动上面订单状态的支付按钮-->
    <van-dialog :show-confirm-button="false" v-model:show="showCode">
      <van-icon name="cross" @click="closeCode" class="close" />
      <div>微信支付</div>
      <van-image height="150" width="150" :src="url" />
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>

    <!-- 信息 -->
    <!-- 渲染预约信息  value 对象的当前键值 key	对象的当前键名 注意这里要用formData 因为时间被处理了,你用原来的deatilPageData不对啊-->
    <van-cell-group class="card">
      <div class="header-text">预约信息</div>
      <van-cell
        v-for="(value, key) in appointmentInformation"
        :title="value"
        :key="key"
        :value="formatData(key)"
      />
    </van-cell-group>
    <!-- 渲染订单信息 -->
    <van-cell-group class="card">
      <div class="header-text">订单信息</div>
      <van-cell
        v-for="(value, key) in orderInformation"
        :title="value"
        :key="key"
        :value="formatData(key)"
      />
      <van-cell title="联系客服" value="疑问或投诉>" />
    </van-cell-group>
  </div>

</template>

<style scoped lang="less">
.container {
    background-color: #f0f0f0;
    min-height: 100vh;/* 改为最小高度，确保内容少时也能撑开 */
  }
  .card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
      padding-left: 5px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid red;
    }
  }
  .dzf {
    padding: 20px;
    .text1 {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }
    .text2 {
      font-size: 14px;
      color: #666;
    }
    .text3 {
      text-align: center;
      .van-button {
        margin-top: 10px;
        margin-left: 10px;
        width: 80%;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>

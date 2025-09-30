<script setup>
import { useRouter } from 'vue-router'
import orderStatusBar from '@/components/orderStatusBar.vue'
import { getCreateOrderPageDataAPI } from '@/api'
import { computed, onMounted, ref } from 'vue'
const router = useRouter()

//创建订单页的数据
const createOrderPageData = ref({})
//获取创建订单页的数据
onMounted(async ()=>{
  const res = await getCreateOrderPageDataAPI()
  createOrderPageData.value = res.data.data
  console.log(createOrderPageData.value,'创建订单页数据')
})


//创建订单页的表单数据 这里根据接口要求的数据写内容就可以 见接口文档api
const form = ref({
  hospital_id: '',
  hospital_name: '',
  deman: '',
  companion_id: 0,
  receiveAddress: '',
  tel: '',
  starttime: 0
})
//弹窗选择医院
const showHospital = ref(false)
//医院下拉菜单数据处理 格式按照vant要求 使用计算属性处理一下
const hospitalColumns = computed(()=> {
  return createOrderPageData.value.hospitals.map((item)=>{
    return { text: item.name, value:item.id }
  })
})
//选择医院操作
const hospitalOnConfirm = (item)=>{
  console.log(item,'选择医院返回的数据')
  //selectedValues和selectedOptions是vant返回的属性值
  form.value.hospital_id = item.selectedValues[0]
  form.value.hospital_name = item.selectedOptions[0].text
  //关闭选择医院的弹出层
  showHospital.value = false
}

//弹窗选择日期
const showDate = ref(false)
//当前选择日期和最小日期，最小日期就是当天
const currentDate = ref()
const minDate = ref(new Date())
//选择日期操作
const dateOnConfirm = (item)=>{
  console.log(item,'选择日期返回的数据')
  //将数组日期转化为字符串
  const stringDate = item.selectedValues.join('-')
  //将处理好的日期赋值给currentDate进行回显
  currentDate.value = stringDate
  console.log(stringDate)
  //再处理一下 转化为接口要的时间戳
  form.value.starttime = new Date(stringDate).getTime()
  //关闭选择时间的弹出层
  showDate.value = false
}
</script>

<template>
  <!-- 顶部导航栏 -->
  <div class="container">
    <div class="header">
      <van-icon
        @click="router.go(-1)"
        class="header-left"
        name="arrow-left"
        size="30"
      />
      填写服务订单
    </div>

    <!-- 订单进度 -->
    <orderStatusBar :item="0"></orderStatusBar>

    <!-- 订单列表 通过vant cell单元格渲染-->
    <van-cell class="cell">
      <!-- 使用 title 插槽来自定义标题 #title是左侧 #default是右侧内容-->
      <!-- 这里层级太深了 必须用可选链 -->
      <template #title >
        <!-- 这里需要对插槽内部弹性布局一下 让图片和文字垂直居中 -->
        <div style="display: flex; align-items: center;">
          <van-image
            height="30"
            width="30"
            :src="createOrderPageData.service?.serviceImg"
          />
          <span style="margin-left: 15px;">{{ createOrderPageData.service?.serviceName }}</span>
        </div>
      </template>
      <template #default> <div class="service-text">服务内容</div></template>
    </van-cell>
    
    <!-- 表单 -->
    <van-cell-group class="cell">
      <!-- 选择就诊医院 -->
      <van-cell>
        <template #title>就诊医院 </template>
        <template #default>
          <div @click="showHospital = true">
            {{ form.hospital_name || "请选择就诊医院"}}
            <van-icon name="arrow" />
          </div>
        </template>
      </van-cell>
      <!-- 选择就诊时间 -->
      <van-cell>
        <template #title>就诊时间</template>
        <template #default>
          <div @click="showDate = true">
            {{ currentDate || "请选择就诊时间" }}
            <van-icon name="arrow" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 选择医院弹出层 -->
    <van-popup v-model:show="showHospital"  position="bottom">
      <van-picker
        title="请选择医院"
        :columns="hospitalColumns"
        @confirm="hospitalOnConfirm"
        @cancel="showHospital = false"
      />
    </van-popup>
    <!-- 选择时间弹出层 -->
    <van-popup v-model:show="showDate"  position="bottom">
      <van-date-picker
        title="请选择时间"
        :min-date="minDate"
        @confirm="dateOnConfirm"
        @cancel="showDate = false"
      />
    </van-popup>

  </div>
</template>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}

.cell {
  align-items: center;
  width: 98%;
  margin: 5px auto;
  background-color: #fff;
  border-radius: 2%;
  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }
}
.service-text {
  background: url('/images/warning_trans.png')
    no-repeat center center;
  background-size: 20px;
}
.sumbit {
  position: absolute;
  bottom: 0;
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

<script setup>
import { useRouter } from 'vue-router'
import orderStatusBar from '@/components/orderStatusBar.vue'
import { getCreateOrderPageDataAPI,submitCreateOrderAPI } from '@/api'
import { computed, onMounted, ref } from 'vue'
import { showNotify } from 'vant'
import QRCode from 'qrcode'
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
  demand: '',
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

//陪诊师弹窗
const showCompanion =  ref(false)
//选择的陪诊师
const selectCompanion = ref()
//陪诊师弹窗数据 同之前 需要处理成vant要求的格式
const companionColumns = computed(()=> {
  return createOrderPageData.value.companion.map((item)=>{
    return { text: item.name, value:item.id }
  })
})
//陪诊师弹窗确认操作
const companionOnConfirm = (item)=>{
  console.log(item,'选择陪诊师返回的数据')
  //selectedValues和selectedOptions是vant返回的属性值
  form.value.companion_id = item.selectedValues[0]
  selectCompanion.value = item.selectedOptions[0].text
  //关闭选择医院的弹出层
  showCompanion.value = false
}

//点击提交按钮 进行表单校验

const sumbit = async ()=>{
  const valForm = [
    'companion_id',
    'demand', 
    'hospital_id',
    'hospital_name',
    'receiveAddress',
    'starttime',
    'tel',
  ]
  // 检查是否所有字段都已填写 (allFilled 为 true 表示所有都已填写) form.value[item]相当于用键名取键值
  const allFilled = valForm.every((item)=> form.value[item])
  if(!allFilled){
    // 如果不是所有字段都填写了
    showNotify({ type: 'warning',message: '请把每一项都填写!' })
    return
  }
  const res = await submitCreateOrderAPI(form.value)
  console.log(res,'提交订单信息')
  if(res.data.code === 10000){
    showNotify({ type: 'success', message: '订单创建成功！'})
  }
  //将 支付链接字符串 转化成 可供网页显示的二维码图片源（src）
  url.value = await QRCode.toDataURL(res.data.data.wx_code)
  console.log(url.value,'转换好的二维码src')
  //弹出二维码支付框
  showCode.value = true
}
//这块儿扫码成功之后后端没有给数据 所以这块儿逻辑写不了
//支付二维码弹窗
const showCode = ref(false)
//二维码数据
const url = ref()
//关闭支付二维码弹窗
const closeCode = () => {
  showCode.value = false
  router.push('/order')
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
      <!-- 选择陪诊师 -->
      <van-cell>
        <template #title>陪诊师</template>
        <template #default>
          <div @click="showCompanion = true">
            {{  selectCompanion || "请选择陪诊师" }}
            <van-icon name="arrow" />
          </div>
        </template>
      </van-cell>
      <!-- 输入地址 -->
      <van-cell >
        <template #title>接送地址</template>
        <template #default>
          <van-field v-model="form.receiveAddress"  input-align="right" placeholder="请输入接送地址" />
        </template>
      </van-cell>
      <!-- 输入联系电话 -->
      <van-cell >
        <template #title>联系电话</template>
        <template #default>
          <van-field v-model="form.tel"  input-align="right" placeholder="请输入联系电话" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 服务需求部分 备注 -->
    <van-cell-group title="服务需求" class="cell">
      <van-field
        style="height: 100px"
        v-model="form.demand"
        placeholder="请简单描述您要就诊的科室..."
      />
    </van-cell-group>

    <!-- 底部按钮 -->
    <van-button @click="sumbit" class="sumbit" type="primary" size="large">提交订单</van-button>
    
    
    <!-- 以下是弹出层部分的内容 -->
    <!-- 选择医院弹出层 弹出层包选择器-->
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
    <!-- 选择陪诊师弹出层 弹出层包选择器-->
    <van-popup v-model:show="showCompanion"  position="bottom">
      <van-picker
        title="请选择陪诊师"
        :columns="companionColumns"
        @confirm="companionOnConfirm"
        @cancel="showCompanion = false"
      />
    </van-popup>

    <!-- 二维码支付弹窗 :show-confirm-button="false"是不展示确认按钮-->
    <van-dialog :show-confirm-button="false" v-model:show="showCode">
      <van-icon name="cross" @click="closeCode" class="close" />
      <div>微信支付</div>
      <van-image height="150" width="150" :src="url" />
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>

  </div>
</template>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  min-height: 100vh; /* 改为最小高度，确保内容少时也能撑开 */
  /* 为固定底部的按钮留出空间（约 50px-70px） */
  padding-bottom: 70px; 
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
  width: 97%;
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
/* 确保按钮固定在视口底部并占满宽度 */
.sumbit {
  position: fixed; /* 改为 fixed，固定在屏幕底部 */
  bottom: 0;
  left: 0; 
  width: 100%; 
  z-index: 99; /* 确保它在其他元素之上 */
  border-radius: 0;
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

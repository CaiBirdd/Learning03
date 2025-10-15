<script setup>
import { onMounted, ref } from 'vue'
import { getHomePageDataAPI } from '@/api'
import { useRouter } from 'vue-router'

//搜索数据
const searchValue = ref('')
const onSearch = ()=>{

}
//首页数据
const homeData = ref({
})
//拿首页数据
onMounted(async ()=>{
  const res = await getHomePageDataAPI()
  homeData.value = res.data.data
  console.log(homeData.value,'首页数据')
})

//快捷跳转
const router = useRouter()
const goQuickJump = (index)=>{
  router.push(`/createOrder?id=${homeData.value.hospitals[index].id}`) 
}
//医院列表点击跳转
const goCreateOrder = (item)=>{
  router.push(`/createOrder?id=${item.id}`) 
}
</script>

<template>
  <!-- 顶部导航区域 -->
  <div class="header">
    <div class="header-left">
      中部地区
      <van-icon name="arrow" />
    </div>
    <van-search
      shape="round"
      v-model="searchValue"
      placeholder="找医院"
      @search="onSearch"
    />
  </div>
  <!-- 轮播图区域 -->
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" height="170">
    <van-swipe-item v-for="item in homeData.slides" :key="item.id">
      <van-image 
        radius="5"
        :src="item.pic_image_url"
      />
    </van-swipe-item>
  </van-swipe>
  <!-- 快捷入口区域 在这里是遍历的里面列-->
  <van-row justify="space-around">
    <van-col
      v-for="(item, index) in homeData.nav2s"
      :key="item.id"
      span="11"
      @click="goQuickJump(index)"
    >
      <van-image 
        :src="item.pic_image_url"
      />
    </van-col>
  </van-row>
  <!-- 医院列表 这里是遍历的外面的行-->
  <van-row
    class="yy-list"
    v-for="item in homeData.hospitals"
    :key="item.id"
    justify="space-around"
    @click="goCreateOrder(item)"
  >
    <van-col span="6">
      <van-image radius="5" width="100" height="90" :src="item.avatar_url" />
    </van-col>
    <van-col class="yy" span="15">
      <div class="yy-name">{{ item.name }}</div>
      <div class="yy-type">
        <span>{{ item.rank }}</span>
        &nbsp;
        <span>{{ item.label }}</span>
      </div>
      <div class="yy-text">{{ item.intro }}</div>
    </van-col>
  </van-row>
  <div class="bottom-text">没有更多了</div>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  //关键：让子元素垂直居中（解决文本/图标/搜索框对齐问题）
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  //移除line-height（避免影响Flex子元素整体对齐），改用height控制区域高度 
  height: 54px; 
  padding: 0 5px; // 增加水平内边距，避免元素贴边

  .header-left {
    display: flex; //让“文字+图标”水平排列且垂直居中
    align-items: center;
    padding-left: 24px; //背景图20px + 2px间距，避免文字贴背景图
    background: url('/images/ic_city.png') no-repeat left center;//将原来的base64图片替换为实际图片 水平方向靠左，垂直方向居中
    background-size: 20px; //明确背景图尺寸，避免拉伸
    font-size: 20px;
    font-weight: bold;
    color: #666666;
    gap: 8px; //文字与图标之间的间距，比默认更美观
  }

  //控制搜索框样式，与左侧高度匹配
  .van-search {
    width: 60%; //或用flex:1，根据需求调整搜索框宽度
  }
}
.my-swipe {
  margin: 5px;
}
.yy-list {
  padding-bottom: 10px;
  margin: 20px 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  .yy {
    .yy-name {
      font-size: 20px;
      line-height: 30px;
      font-weight: bold;
    }
    .yy-type {
      font-weight: bold;
      line-height: 25px;
      font-size: 15px;
      color: #0ca7ae;
    }
    .yy-text {
      font-size: 14px;
      color: #999999;
    }
  }
}
.bottom-text {
  line-height: 70px;
  text-align: center;
  color: #999999;
}
</style>

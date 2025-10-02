<script setup>
import { computed ,ref} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
//从本地拿用户信息
const userInfo = computed(() => {
  return JSON.parse(localStorage.getItem('h5_userInfo')) || {}
})

//订单跳转
const goOrderPage = (active) => {
  router.push(`/order?active=${active}`)
}
//分享
const showShare = ref(false)
//分享信息 均来自vant
const options = [
  [
    { name: '微信', icon: 'wechat' },
    { name: '朋友圈', icon: 'wechat-moments' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' },
  ],
  [
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
    { name: '小程序码', icon: 'weapp-qrcode' },
  ],
]

//退出登录
const showQuit = ref(false)
const logOut =  ()=>{
  localStorage.removeItem('h5_userInfo')
  localStorage.removeItem('h5_token')
  router.push('/login')
}
</script>


<template>
  <div class="container">
    <!-- 顶部用户信息 -->
    <div class="user">
      <van-image class="img" width="100" height="100" :src="userInfo.avatar" />
      <div class="text">{{ userInfo.name }}</div>
    </div>
    <div class="order">
      <!-- 传空的默认是全部订单 -->
      <div class="top" @click="goOrderPage('')">
        <div class="text1">我的订单</div>
        <div class="text2">全部</div>
      </div>
      <div class="bottom">
        <div @click="goOrderPage(1)" class="item">
          <van-image  width="40" height="40" src="/images/od_10.png" />
          <div>待支付</div>
        </div>
        <div @click="goOrderPage(2)" class="item">
          <van-image width="40" height="40" src="/images/od_20.png" />
          <div>待服务</div>
        </div>
        <div @click="goOrderPage(3)" class="item">
          <van-image width="40" height="40" src="/images/od_30.png" />
          <div>已完成</div>
        </div>
        <div @click="goOrderPage(4)" class="item">
          <van-image width="40" height="40" src="/images/od_40.png" />
          <div>已取消</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="foot1">
        <div class="text1">
          <van-image width="20" height="20" src="/images/ic_clients.png" />
          服务对象管理
        </div>
        <div class="text2"><van-icon name="arrow" /></div>
      </div>
      <div @click="showShare = true" class="foot2">
        <div class="text1">
          <van-image width="20" height="20" src="/images/ic_share.png" />
          分享转发
        </div>
        <div class="text2"><van-icon name="arrow" /></div>
      </div>
    </div>
    <!-- 点击分享，这里基本全是vant实现 -->
    <van-share-sheet 
      v-model:show="showShare" 
      title="转发分享" 
      :options="options" />

    <!-- vant自定义dialog退出操作 -->
    <van-button type="danger" @click="showQuit= true" class="quit" size="large">退出登录</van-button>
    <van-dialog 
      @cancel="showQuit = false" 
      @confirm="logOut" 
      v-model:show="showQuit" 
      title="提示" 
      show-cancel-button
    >
      <div class="quit_text">是否确认退出登录</div>
    </van-dialog>
  </div>
</template>

<style scoped lang="less">
.container {
  background-color: #f0f0f0;
  min-height: 100vh;
  overflow: hidden;

  .user {
    width: 95%;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    margin: 10px;

    .img {
      margin-top: 30px;
    }

    .text {
      line-height: 30px;
      font-weight: bold;
    }
  }

  .order {
    width: 90%;
    margin: 10px;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;

    .top {
      margin: 10px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;

      .text1 {
        color: #333;
      }

      .text2 {
        color: #999;
      }

      border-bottom: 0.5px solid #f5f5f5;
    }

    .bottom {
      padding: 10px;
      display: flex;
      justify-content: space-around;

      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .foot {
    margin: 0 10px;
    padding: 10px;
    line-height: 50px;
    background-color: #fff;

    .foot1,
    .foot2 {
      display: flex;
      justify-content: space-between;
      color: #555;
    }

    .foot1 {
      border-bottom: 0.5px solid #f5f5f5;
    }
  }

  .quit {
    width: 90%;
    margin: 20px;
  }

  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>

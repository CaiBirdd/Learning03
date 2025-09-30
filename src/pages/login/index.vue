<script setup>
import { ref } from 'vue'
import { showNotify } from 'vant'
import { userLoginAPI } from '@/api'
import { useRouter } from 'vue-router'

//表单数据
const form = ref({
  userName:'',
  passWord:''
})
//提交表单登录
const router = useRouter()
const onSubmit = async ()=>{
  const res = await userLoginAPI(form.value)
  console.log(res,'登录信息')
  if(res.data.code === 10000){
    showNotify({ type: 'success', message: '登录成功！'})
    // 登陆成功后将token放入本地缓存 
    // 用户信息是对象 转成字符串存入
    localStorage.setItem('h5_token', res.data.data.token)
    localStorage.setItem('h5_userInfo', JSON.stringify(res.data.data.userInfo))
    //跳转首页
    router.push('/home')
  }
}
</script>
 
  
<template>
  <div>
    <h1>用户登录</h1>
    <!-- 只有在所有校验都通过的情况下，van-form 才会最终触发 @submit 事件，执行你的 onSubmit 登录函数。 -->
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.userName"
          name="userName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.passWord"
          type="password"
          name="passWord"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <!-- native-type="submit"让按钮变成一个原生的提交按钮。 这的submit联动上面的form-->
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>

</template>

<style scoped lang="less">
h1 {
  text-align: center;
}
</style>

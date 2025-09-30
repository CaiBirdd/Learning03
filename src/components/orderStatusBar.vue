<script setup>
defineProps(['item'])
</script>

<template>
  <div class="od-banner">
    <img class="od-banner-icon" src="/images/od_bg_icon.png" mode="widthFix" />
    <div class="od-jd" :class="[`od-jd-${item}`]">
      <div class="od-jd-out">
        <div class="od-jd-in"></div>
      </div>
      <div class="vp-flex od-jd-text">
        <div class="vp-flex_1">
          <text class="od-jd-st-0">填写订单</text>
        </div>
        <div class="vp-flex_1">
          <text class="od-jd-st-10">在线支付</text>
        </div>
        <div class="vp-flex_1">
          <text class="od-jd-st-20">专人服务</text>
        </div>
        <div class="vp-flex_1">
          <text class="od-jd-st-30">服务完成</text>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="less" scoped>
.vp-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.vp-flex_1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-tap-highlight-color: transparent;
}
.od-banner {
  overflow: hidden;
  position: relative;
  background: url('/images/od_bg.png')
    repeat-y center;
  background-size: 100%;
}
.od-banner-icon {
  position: absolute;
  top: 15px;
  right: -10px;
  width: 65px;
  opacity: 0.6;
}

.od-jd {
  margin: 30px 20px;
}
.od-jd-out {
  background: #ffffff;
  border: 2.5px solid #ffffff;
  height: 10px;
  line-height: 10px;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
}
.od-jd-in {
  height: 10px;
  line-height: 10px;
  border-radius: 25px;
  overflow: hidden;
  width: 0%;
  background: url('/images/od_bg.png')
    repeat-y center;
  background-size: 100%;
}
.od-jd-text {
  text-align: center;
  padding-top: 15px;
}
.od-jd-text text {
  color: #ffffff;
  font-size: 13px;
  opacity: 0.7;
}

.od-jd-0 .od-jd-in {
  width: 12%;
}
.od-jd-0 .od-jd-st-0 {
  opacity: 1;
  font-weight: bold;
}
.od-jd-10 .od-jd-in {
  width: 37%;
}
.od-jd-10 .od-jd-st-10 {
  opacity: 1;
  font-weight: bold;
}
.od-jd-20 .od-jd-in {
  width: 64%;
}
.od-jd-20 .od-jd-st-20 {
  opacity: 1;
  font-weight: bold;
}
.od-jd-30 .od-jd-in {
  width: 100%;
}
.od-jd-30 .od-jd-st-30 {
  opacity: 1;
  font-weight: bold;
}
.od-jd-40 .od-jd-in {
  width: 100%;
  background: #999999;
}
</style>

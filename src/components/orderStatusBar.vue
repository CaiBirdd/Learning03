<script setup>
import { computed } from 'vue'

const props = defineProps(['item'])

// 订单状态映射表：用于循环渲染底部的文字步骤
const statusMap = [
  { label: '填写订单', value: 0 },
  { label: '在线支付', value: 10 },
  { label: '专人服务', value: 20 },
  { label: '服务完成', value: 30 },
]

// 计算进度条的宽度百分比
// 根据传入的 item (订单状态码) 返回对应的宽度
const progressWidth = computed(() => {
  const widthMap = {
    0: '12%',
    10: '37%',
    20: '64%',
    30: '100%',
    40: '100%' // 状态40通常代表取消或退款，进度条也显示满(但颜色可能不同)
  }
  return widthMap[props.item] || '0%'
})
</script>

<template>
  <div class="od-banner">
    <img class="od-banner-icon" src="/images/od_bg_icon.png" mode="widthFix" />
    
    <div class="od-jd">
      <!-- 进度条区域 -->
      <div class="od-jd-out">
        <!-- 内部进度条：宽度由 progressWidth 控制，颜色由 is-gray 控制 -->
        <div 
          class="od-jd-in" 
          :class="{ 'is-gray': item === 40 }" 
          :style="{ width: progressWidth }"
        ></div>
      </div>

      <!-- 底部文字状态区域 -->
      <div class="od-jd-text">
        <div 
          v-for="step in statusMap" 
          :key="step.value" 
          class="od-jd-step"
        >
          <!-- 只有当前状态匹配时，文字才高亮显示 -->
          <span :class="{ 'active': item === step.value }">
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.od-banner {
  overflow: hidden;
  position: relative;
  background: url('/images/od_bg.png') repeat-y center;
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
  background: url('/images/od_bg.png') repeat-y center;
  background-size: 100%;
  transition: width 0.3s ease; /* 添加平滑过渡效果 */

  /* 状态40时的特殊灰色样式 */
  &.is-gray {
    background: #999999;
  }
}

.od-jd-text {
  display: flex;
  margin-top: 15px;

  .od-jd-step {
    flex: 1;
    text-align: center;

    span {
      color: #ffffff;
      font-size: 13px;
      opacity: 0.7;
      transition: opacity 0.3s;

      /* 激活状态：高亮加粗 */
      &.active {
        opacity: 1;
        font-weight: bold;
      }
    }
  }
}
</style>

<template>
  {{ formater }}
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  millisecond: {
    type: Number,
    default: 0,
  },
  format: {
    type: String,
    default: 'hh:mm:ss',
  },
})

const emit = defineEmits(['counterOver'])

// 剩余毫秒数
const diff = ref(0)
let timer = null

// 根据当前剩余时间，自动计算格式化后的字符串
const formater = computed(() => {
  const duration = Math.max(0, Math.floor(diff.value / 1000))
  
  const h = Math.floor(duration / 3600)
  const m = Math.floor((duration % 3600) / 60)
  const s = duration % 60

  // 使用 padStart 补零，例如 5 -> '05'
  return props.format
    .replace('hh', h.toString().padStart(2, '0'))
    .replace('mm', m.toString().padStart(2, '0'))
    .replace('ss', s.toString().padStart(2, '0'))
})

// 开启倒计时逻辑
const startTimer = () => {
  // 1. 初始化剩余时间
  diff.value = props.millisecond || 0
  
  // 2. 清除之前的定时器（防止多次调用叠加）
  if (timer) clearInterval(timer)
  
  // 3. 如果初始时间已经是0，直接结束
  if (diff.value <= 0) {
    emit('counterOver')
    return 
  }

  // 4. 启动定时器
  timer = setInterval(() => {
    diff.value -= 1000
    if (diff.value <= 0) {
      diff.value = 0
      clearInterval(timer)
      emit('counterOver')
    }
  }, 1000)
}

// 监听 incoming props 变化：比如接口数据晚回来，或者时间被更新
watch(
  () => props.millisecond,
  () => startTimer()
)

onMounted(() => {
  startTimer()
})

// 组件销毁时必须清除定时器，防止内存泄漏
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style></style>
  
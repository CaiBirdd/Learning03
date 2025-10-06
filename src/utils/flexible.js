// 移动端适配核心文件
import 'amfe-flexible'

// 设置HTML根元素字体大小
export function setRem() {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
  const htmlDom = document.getElementsByTagName('html')[0]
  htmlDom.style.fontSize = htmlWidth / 10 + 'px'
}

// 添加视口配置
export function setViewport() {
  // 创建meta标签
  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
  
  // 添加到head
  document.getElementsByTagName('head')[0].appendChild(meta)
}

// 初始化
export function initFlexible() {
  setRem()
  setViewport()
  
  // 窗口大小变化时重新设置
  window.addEventListener('resize', setRem)
}
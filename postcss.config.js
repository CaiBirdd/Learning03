export default {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375, // 设计稿宽度，Vant 官方推荐 375
      viewportUnit: 'vw', // 转换后的单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      unitPrecision: 5, // 转换后保留的小数位数
      propList: ['*'], // 所有属性都转换
      selectorBlackList: ['.novw'], // 不转换的选择器，添加 .novw 类名可以避免转换
      minPixelValue: 1, // 小于1px的不转换
      mediaQuery: false, // 是否在媒体查询中也转换px
      exclude: [/node_modules/], // 排除 node_modules
    },
  },
}

export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // Vant 官方推荐的设计稿宽度为 375，rootValue 设为 37.5
      propList: ['*'], // 所有属性都转换
      selectorBlackList: ['.norem'], // 不转换的选择器，添加 .norem 类名可以避免转换
      minPixelValue: 2, // 小于2px的不转换
    },
  },
}
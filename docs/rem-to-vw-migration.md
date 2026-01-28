# 移动端适配方案迁移：rem → vw

## 概述

将移动端适配方案从 `rem` 迁移到 `vw`，移除 JavaScript 运行时依赖，采用纯 CSS 方案实现响应式布局。

---

## 修改内容

### 1. 删除文件

| 文件                    | 说明                                                       |
| ----------------------- | ---------------------------------------------------------- |
| `src/utils/flexible.js` | 原 rem 适配核心文件，包含 `amfe-flexible` 和根字体设置逻辑 |

### 2. 更新文件

#### `src/main.js`

```diff
  import { createApp } from 'vue'
  import App from './App.vue'
  import router from './router'
  import 'vant/es/notify/style/index.mjs'
- import { initFlexible } from './utils/flexible'
-
- // 初始化移动端适配
- initFlexible()

  const app = createApp(App)
```

#### `postcss.config.js`

```diff
  export default {
    plugins: {
-     'postcss-pxtorem': {
-       rootValue: 37.5,
-       propList: ['*'],
-       selectorBlackList: ['.norem'],
-       minPixelValue: 2,
-     },
+     'postcss-px-to-viewport': {
+       viewportWidth: 375,        // 设计稿宽度
+       viewportUnit: 'vw',        // 转换后的单位
+       fontViewportUnit: 'vw',    // 字体使用的视口单位
+       unitPrecision: 5,          // 小数位数
+       propList: ['*'],           // 所有属性都转换
+       selectorBlackList: ['.novw'],  // 不转换的选择器
+       minPixelValue: 1,          // 小于1px的不转换
+       mediaQuery: false,         // 媒体查询中不转换
+       exclude: [/node_modules/], // 排除 node_modules
+     },
    },
  }
```

### 3. 依赖变更

```diff
  devDependencies: {
-   "amfe-flexible": "^2.2.1",
-   "postcss-pxtorem": "^6.1.0",
+   "postcss-px-to-viewport": "^1.1.1",
  }
```

---

## 方案对比

| 特性           | rem 方案             | vw 方案                |
| -------------- | -------------------- | ---------------------- |
| **原理**       | 根据根字体大小计算   | 直接使用视口宽度百分比 |
| **JS 依赖**    | 需要 `amfe-flexible` | 无需 JS                |
| **运行时计算** | 需要监听 resize 事件 | 纯 CSS，无运行时计算   |
| **精度**       | 受根字体取整影响     | 视口单位更精确         |
| **兼容性**     | IE9+                 | iOS 8+, Android 4.4+   |

---

## 使用说明

### 开发时

直接使用 **px** 单位编写样式，PostCSS 会在构建时自动转换为 **vw**：

```css
/* 开发时编写 */
.box {
  width: 100px;
  font-size: 16px;
  padding: 10px 20px;
}

/* 构建后输出 */
.box {
  width: 26.66667vw;
  font-size: 4.26667vw;
  padding: 2.66667vw 5.33333vw;
}
```

### 不转换的情况

添加 `.novw` 类名可避免转换：

```html
<div class="novw">
  <!-- 内部元素的 px 不会被转换 -->
</div>
```

---

## 计算公式

```
vw 值 = (px 值 / 设计稿宽度) × 100

示例：100px / 375 × 100 = 26.66667vw
```

---

_文档生成时间：2026-01-27_

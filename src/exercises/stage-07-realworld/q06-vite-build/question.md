# Q06 — Vite 建置優化（Code Splitting / 動態 import）

## 對應官方文件
- 章節：Building for Production
- URL：https://vite.dev/guide/build

## 題型
重構

## 難度
⭐⭐⭐ 進階

## 題目說明
Code Splitting（程式碼分割）讓應用不必在首次載入時下載所有 JS，改用「按需載入」提升效能。

| 技術 | 說明 |
|------|------|
| 動態 `import()` | 將元件分割成獨立 chunk |
| `defineAsyncComponent` | Vue 元件的動態載入包裝器 |
| 路由懶載入 | `() => import('./views/PageView.vue')` |
| `vite.config.js` `manualChunks` | 手動控制哪些模組打包在一起 |

```js
// ❌ 靜態 import：永遠打包進主 bundle
import HeavyChart from './HeavyChart.vue'

// ✅ 動態 import：首次使用時才下載
const HeavyChart = defineAsyncComponent(
  () => import('./HeavyChart.vue')
)
```

## 起手式說明
`Starter.vue` 有一個使用靜態 import 的「重型元件」模擬。
**需要你重構：**
1. 將靜態元件改為 `defineAsyncComponent` + 動態 `import()`
2. 加入 `loadingComponent` 骨架屏（載入中時顯示）
3. 加入 `errorComponent`（載入失敗時顯示）

## 驗收標準
- [ ] 元件改用 defineAsyncComponent 包裝
- [ ] 提供 loadingComponent（骨架屏）
- [ ] 提供 errorComponent 或 onError 回調
- [ ] 能解釋 vite.config.js 的 manualChunks 用途

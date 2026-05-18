# Q07 — 路由懶載入（動態 import）

## 對應官方文件
- 章節：Lazy Loading Routes
- URL：https://router.vuejs.org/guide/advanced/lazy-loading

## 題型
找錯誤 + 重構

## 難度
⭐⭐ 中級

## 題目說明
Vue Router 的路由 `component` 欄位支援「懶載入」：
只在使用者訪問該路由時，才下載對應元件的 JavaScript chunk。
這樣可以大幅縮短首次載入時間（尤其是頁面多的大型應用）。

懶載入寫法：`component: () => import('./views/MyView.vue')`

## 起手式說明
`Starter.vue` 中有一段路由設定，包含 3 個問題：
- Bug A：使用靜態 import（非懶載入）
- Bug B：箭頭函式語法錯誤（缺少 `return` 或括號）
- Bug C：Vite 不支援完全動態的模板字串 import（build time 無法解析）

請你：
1. 找出 3 個 Bug 並說明原因
2. 在 Part B 填入修正後的正確寫法

## 驗收標準
- [ ] 能說明靜態 import vs 懶載入的差異（首次載入 bundle 大小）
- [ ] 知道箭頭函式要回傳 Promise（需要 `return` 或括號包覆）
- [ ] 了解 Vite / Rolldown 的動態 import 限制（路徑必須含靜態字面量）
- [ ] 知道 Vite magic comment `/* @vite-ignore */` 的用途

## 提示
- `import HomeView from './HomeView.vue'` → 靜態，一律打包進 main chunk
- `() => import('./HomeView.vue')` → 動態，分割成獨立 chunk（懶載入）
- `() => { import('./View.vue') }` → 錯誤！函式體內 import 但沒有 return
- `() => import('./views/' + name + '.vue')` → Vite 無法靜態分析，build 時報錯

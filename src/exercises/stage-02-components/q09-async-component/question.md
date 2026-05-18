# Q09 — defineAsyncComponent 非同步載入

## 對應官方文件
- 章節：Async Components
- URL：https://vuejs.org/guide/components/async

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
`_HeavyDashboard.vue` 模擬一個「載入耗時」的重型元件。
你需要用 `defineAsyncComponent` 非同步載入它，並提供 loading 和 error 狀態的 UI。

## 起手式說明
`Starter.vue` 中已有：
- `_HeavyDashboard.vue` 的匯入路徑
- Loading 和 Error 元件定義
- 元件掛載區的 TODO

請你完成：
1. 使用 `defineAsyncComponent` 定義非同步元件
2. 設定 `loader`（動態 import）、`loadingComponent`、`errorComponent`、`delay`

## 驗收標準
- [ ] `defineAsyncComponent({ loader: () => import(...) })` 語法正確
- [ ] 載入期間顯示 Loading 元件（出現 ≥ 200ms 才顯示，避免 flash）
- [ ] 載入完成後顯示 HeavyDashboard 內容
- [ ] 若載入失敗（可模擬），顯示 Error 元件

## 提示
- `defineAsyncComponent(loader)` — 最簡單寫法，只傳 loader 函式
- `defineAsyncComponent({ loader, loadingComponent, errorComponent, delay })` — 完整選項寫法
- `delay`（毫秒）：loading 元件顯示的延遲，避免一閃即逝的 spinner
- 搭配 `<Suspense>` 可以集中管理多個非同步元件的 loading 狀態

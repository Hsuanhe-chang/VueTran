# Q03 — 非同步 Composable（useFetch pattern）

## 對應官方文件
- 章節：Composables — Async State Example
- URL：https://vuejs.org/guide/reusability/composables#async-state-example

## 題型
功能實作

## 難度
⭐⭐ 中級

## 題目說明
實作 `useFetch(url)` composable，封裝非同步資料獲取的完整流程。
使用 JSONPlaceholder API（`https://jsonplaceholder.typicode.com`）作為測試後端。

## 起手式說明
`Starter.vue` 中已有：
- composable 的回傳狀態結構（data / error / isLoading）
- template UI（已根據三種狀態顯示不同內容）
- 換頁按鈕（會改變 url ref）

請你完成 `useFetch(url)` composable：
1. 宣告 `data`、`error`、`isLoading` 三個 ref
2. 用 `watchEffect` 監聽 url 變化，自動重新 fetch
3. fetch 前重置狀態，fetch 完後更新對應 ref

## 驗收標準
- [ ] 頁面載入後自動 fetch 第一頁文章
- [ ] isLoading 為 true 時顯示 loading 動畫
- [ ] fetch 成功後顯示文章列表
- [ ] 點擊「下一頁」切換文章後，isLoading 再次出現並重新 fetch
- [ ] 若 URL 無效，error ref 有值並顯示錯誤訊息

## 提示
- `watchEffect(() => { ... })` — 自動追蹤回調內的響應式依賴
- 用 `toValue(url)` 取得 url 的當前值（支援字串、ref、getter）
- `fetch(url).then(r => r.json())` — 瀏覽器內建 fetch API
- `try / catch / finally` — 確保 isLoading 在任何情況下都會重置

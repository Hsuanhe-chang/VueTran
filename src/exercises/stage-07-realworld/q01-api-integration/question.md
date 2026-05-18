# Q01 — API 整合模式（useFetch Composable）

## 對應官方文件
- 章節：Composables
- URL：https://vuejs.org/guide/reusability/composables

## 題型
功能實作

## 難度
⭐⭐ 中級

## 題目說明
在真實專案中，API 呼叫邏輯通常包裝成 Composable，以便在多個元件中複用。
`useFetch` 是最常見的模式，管理三個核心狀態：

| 狀態 | 說明 |
|------|------|
| `data` | 成功回傳的資料（初始為 null） |
| `isLoading` | 是否正在請求中 |
| `error` | 錯誤訊息（null 表示無錯誤）|

```js
// 使用方式
const { data, isLoading, error, execute } = useFetch('/api/users')
```

本題使用模擬 API（不需要真實網路連線），展示完整的 Loading → Success/Error 流程。

## 起手式說明
`Starter.vue` 已有：
- `mockApi()` 模擬 API 函式
- `useFetch` composable 骨架（需你補齊）

請你完成：
1. `useFetch(endpoint)` 的完整實作（data / isLoading / error / execute）
2. `execute()` 中正確的 try/catch/finally 流程
3. 在 `onMounted` 中自動觸發第一次請求
4. 在元件中呼叫 `useFetch` 並渲染結果

## 驗收標準
- [ ] 點擊「重新載入」：顯示 Loading 狀態 → 成功後顯示資料
- [ ] 勾選「模擬錯誤」後重試：顯示 Loading → 顯示錯誤訊息
- [ ] isLoading 為 true 時按鈕 disabled
- [ ] 不同 API 端點可切換

## 提示
- `try/catch/finally` 是非同步錯誤處理的標準結構
- `finally` 確保 `isLoading = false` 無論成功或失敗都執行

# Q99 — 綜合題：小型後台管理系統

## 對應官方文件
- 章節：Composables / Error Handling / Building for Production
- URL：https://vuejs.org/guide/reusability/composables

## 題型
功能實作

## 難度
⭐⭐⭐ 進階

## 題目說明
整合 Stage 7 的核心知識點，實作一個具備以下功能的後台管理介面：

| 功能 | 對應知識點 |
|---|---|
| 使用者列表（async API 呼叫）| Q01 — useFetch Composable |
| 子元件錯誤邊界 | Q02 — onErrorCaptured |
| 新增使用者表單（含驗證）| Q03 — 表單驗證 |
| 統計面板（按需異步載入）| Q06 — defineAsyncComponent |

## 起手式說明
`Starter.vue` 已提供：
- Mock API（`mockApiCall`）及測試資料
- `useFetch` 骨架（`execute` 函式為空）
- 表單欄位、touched 追蹤、提交按鈕
- 靜態 `StatsPanel`（尚未改為 async）
- `BuggyWidget`（可在執行時拋出錯誤）

**需要你完成：**
1. `useFetch()` 的 `execute` 函式 — 完整的 try/catch/finally（Q01 回顧）
2. `onErrorCaptured` — 捕捉 BuggyWidget 的錯誤並顯示（Q02 回顧）
3. `errors` computed — 三個欄位的驗證規則（Q03 回顧）
4. 將靜態 `StatsPanel` 改為 `defineAsyncComponent`（Q06 回顧）

## 驗收標準
- [ ] 頁面載入時自動抓取使用者列表（useFetch 的 execute 有完整邏輯）
- [ ] 切換「觸發錯誤」按鈕後，錯誤訊息顯示在上方錯誤面板
- [ ] 表單欄位有驗證（空白 / 格式錯誤時顯示紅字提示）
- [ ] 表單送出成功後，使用者列表增加新一筆資料
- [ ] 統計面板改為 defineAsyncComponent，有 1 秒骨架屏載入動畫

## 提示
- `toValue(endpoint)` 可以讓 endpoint 同時接受 `ref` 或純字串
- `onErrorCaptured` 需要 `return false` 才能阻止錯誤繼續向上傳播
- 表單驗證：名稱長度、Email 格式（含 @）、角色必填
- defineAsyncComponent 的 loader 是一個回傳 `Promise<ComponentDefinition>` 的函式

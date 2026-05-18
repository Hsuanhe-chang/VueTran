# Q02 — 全域錯誤處理（app.config.errorHandler）

## 對應官方文件
- 章節：Application API
- URL：https://vuejs.org/api/application#app-config-errorhandler

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
Vue 3 提供兩層錯誤處理機制：

| 層級 | API | 範圍 |
|------|-----|------|
| 應用層 | `app.config.errorHandler` | 所有未被捕捉的錯誤 |
| 元件層 | `onErrorCaptured` | 子元件樹中的錯誤 |

```js
// main.js — 應用層（全域）
app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error]', err.message)
  // 可在此送到錯誤追蹤服務（Sentry 等）
}

// 元件中 — 元件層（錯誤邊界）
onErrorCaptured((err, instance, info) => {
  errorLog.value.push(err.message)
  return false  // 阻止繼續向上傳播
})
```

## 起手式說明
`Starter.vue` 已有一個會拋出錯誤的子元件 `BuggyWidget`。
**需要你從零撰寫：**
1. 用 `onErrorCaptured` 在父元件捕捉子元件錯誤
2. 建立錯誤日誌列表（陣列 + v-for 顯示）
3. 提供「清除日誌」功能
4. 顯示 `app.config.errorHandler` 的 main.js 設定說明

## 驗收標準
- [ ] 點擊「觸發錯誤」按鈕後，父元件顯示錯誤訊息
- [ ] 頁面不崩潰（onErrorCaptured 已捕捉）
- [ ] 可多次觸發，每次新增一筆錯誤到日誌
- [ ] 清除按鈕能清空日誌

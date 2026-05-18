# Q04 — Teleport 傳送門

## 對應官方文件
- 章節：Teleport
- URL：https://vuejs.org/guide/built-ins/teleport

## 題型
填空

## 難度
⭐⭐ 中級

## 題目說明
`<Teleport>` 讓你把元件的 DOM 輸出到**指定的 DOM 節點**，
而不是渲染在元件樹的當前位置。

常見用途：
- Modal 對話框（避免被父元件的 `overflow: hidden` 裁切）
- Tooltip、Dropdown（需要在最頂層渲染）
- Toast 通知（固定在螢幕角落）

```vue
<!-- 雖然這段程式碼在 App 組件樹內，但 DOM 會渲染到 <body> -->
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>
```

`disabled` prop：`true` 時停用傳送，元素仍渲染在原位（用於條件切換）。

## 起手式說明
`Starter.vue` 中已有：
- Modal 的開關邏輯和 UI
- **TODO 填空**：正確的 Teleport 目標、disabled 條件

請你完成：
1. TODO 1：`<Teleport to="___">` 目標（傳送到 body）
2. TODO 2：`:disabled` 的計算條件（視窗寬度 < 768px 時停用傳送）
3. TODO 3：觀察 DOM 結構（答案說明部分）

## 驗收標準
- [ ] Modal 開啟後，其 DOM 出現在 `<body>` 直接子元素（用 DevTools 驗證）
- [ ] `:disabled` 條件正確（窄螢幕時不傳送）
- [ ] Modal 內的資料/事件仍可存取父元件的 state（Teleport 不影響邏輯上的父子關係）

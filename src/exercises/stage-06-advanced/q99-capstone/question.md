# Q99 — 綜合題：帶動畫的頁面轉場與彈窗系統

## 對應官方文件
- 章節：Transition + KeepAlive + Teleport
- URL：https://vuejs.org/guide/built-ins/transition

## 題型
功能實作

## 難度
⭐⭐⭐ 進階

## 題目說明
整合 Stage 6 所有進階元件技術，實作一個包含：

1. **頁面轉場（Transition）**：切換「分頁」時有滑動動畫
2. **狀態快取（KeepAlive）**：部分頁面離開後保留狀態
3. **彈窗傳送（Teleport）**：Modal 傳送到 body，避免被 overflow 裁切
4. **骨架屏（Suspense-like）**：模擬非同步載入的 Loading 狀態

系統包含三個「頁面」（用動態元件模擬）：
- `HomePage`：公告欄（每次進入都重置 → 不快取）
- `NotesPage`：筆記本（保留輸入內容 → 快取）
- `SettingsPage`：設定頁（保留設定值 → 快取）

彈窗：
- 確認 Dialog（Teleport to body）
- 全域 Toast 通知（Teleport to body）

## 起手式說明
`Starter.vue` 已有：
- 三個頁面元件（defineComponent）
- 切換 Tab 的邏輯
- **TODO**：加入 Transition + KeepAlive + Teleport

## 驗收標準
- [ ] 頁面切換時有水平滑動動畫（mode="out-in"）
- [ ] NotesPage 和 SettingsPage 的狀態在切換後保留
- [ ] HomePage 每次進入都重置
- [ ] 彈窗透過 Teleport 渲染在 body 層級
- [ ] Toast 通知自動消失（3 秒）

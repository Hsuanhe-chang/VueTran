# Q01 — KeepAlive 快取元件狀態

## 對應官方文件
- 章節：KeepAlive
- URL：https://vuejs.org/guide/built-ins/keep-alive

## 題型
填空 + 找錯誤

## 難度
⭐⭐ 中級

## 題目說明
`<KeepAlive>` 是 Vue 的內建元件，用來快取**動態元件**的狀態。
沒有 KeepAlive，每次切換 Tab 時元件都會被銷毀再重建（狀態歸零）。

重要特性：
- `include` / `exclude`：指定哪些元件要快取（用元件 `name` 選項）
- `max`：最多同時快取幾個元件實例（LRU 策略）
- 快取中的元件觸發 `onActivated` / `onDeactivated`（不是 mounted/unmounted）

## 題目
Starter.vue 有 **2 個 Bug**：
1. Bug A：`include` 的值不正確 → 計數器 Tab 沒有被快取
2. Bug B：`max` 的型別錯誤 → 應傳數字而非字串

另有 **2 個 TODO 填空**：
1. TODO 1：補全 `onActivated` 的引入
2. TODO 2：在 CounterTab 元件中使用 `onActivated` 紀錄快取恢復時機

## 驗收標準
- [ ] 切換到「表單」再切回「計數器」，count 保持不變
- [ ] `onActivated` 在每次 Tab 顯示時觸發（非每次 mount）
- [ ] max 正確限制快取數量（傳數字 2，不是字串 '2'）

# Q99 — 綜合題：Todo List 完整實作

## 對應官方文件
- 章節：Stage 1 綜合 — Reactivity + v-for + v-model + Events + Computed + Lifecycle
- URL：https://vuejs.org/guide/essentials/reactivity-fundamentals

## 題型
功能實作

## 難度
⭐⭐⭐ 進階

## 任務說明

這是 Stage 1 的綜合考題，整合所有學過的概念，從零建立一個完整的 **Todo List 應用**。

**完成後的功能清單：**

### 核心功能
- [ ] 輸入框新增待辦事項（按 Enter 或點擊「新增」按鈕）
- [ ] 每個待辦有：id、text、completed（布林）、createdAt（Date）
- [ ] 點擊待辦文字可切換完成狀態（completed ↔ 未完成）
- [ ] 刪除按鈕可移除待辦事項

### 進階功能（選做，但建議挑戰）
- [ ] 篩選器：全部 / 未完成 / 已完成（用 computed 過濾）
- [ ] 底部統計：剩餘未完成數量
- [ ] 「清除已完成」按鈕
- [ ] 空狀態提示（當列表為空時顯示）
- [ ] 輸入框為空時，新增按鈕禁用

## 整合的知識點
- `ref()` — 儲存 todos 陣列與 newTodoText
- `computed()` — filteredTodos（依篩選條件過濾）、remainingCount
- `watch()` 或 `onMounted()` — 可選：從 localStorage 讀取/儲存資料
- `v-model` — 綁定輸入框
- `v-for` + `:key` — 渲染 todo 列表
- `v-if` / `v-show` — 空狀態、篩選 tab 選中狀態
- `@click` / `@keyup.enter` — 事件綁定
- `:class` — 動態套用 completed 樣式

## 驗收標準
- [ ] 新增功能正常，且輸入框在新增後清空
- [ ] 點擊 todo 能正確切換 completed 狀態
- [ ] 刪除按鈕正常移除
- [ ] computed 正確計算剩餘數量
- [ ] 篩選功能正確（全部 / 未完成 / 已完成）
- [ ] 每個 todo 有正確的 :key（使用 id，非 index）
- [ ] 程式碼無 console error

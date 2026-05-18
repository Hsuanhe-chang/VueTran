# Q04 — watch 與 watchEffect

## 對應官方文件
- 章節：Watchers
- URL：https://vuejs.org/guide/essentials/watchers

## 題型
找錯誤 + 從零撰寫

## 難度
⭐⭐ 中級

## 題目說明

Vue 3 提供兩種監聽響應式資料變化的方式：

### `watch(source, callback, options?)`
- 明確指定要監聽的資料來源
- 預設是**懶執行**（lazy）：初始不執行，資料改變才觸發
- 可拿到新值和舊值：`(newVal, oldVal) => {}`
- 選項 `{ immediate: true }` 可讓它初始就執行一次
- 選項 `{ deep: true }` 可深層監聽物件內部變化

### `watchEffect(callback)`
- 自動收集 callback 中用到的所有響應式資料
- **立即執行**（非懶）：初始就會執行一次
- 不需要明確指定來源
- 無法取得舊值

## 任務

**Part A（找錯誤）**：Starter.vue 中有 3 個 watch 相關的 bug，找出並說明。

**Part B（從零撰寫）**：建立一個搜尋框，要求：
1. 當搜尋關鍵字改變時，用 `watch` 監聽並顯示「正在搜尋：xxx」
2. 加入 300ms 的 debounce（避免每個字元都觸發）
3. 用 `watchEffect` 監聽搜尋關鍵字長度，並在長度 > 10 時顯示警告

## 驗收標準
- [ ] Part A：找出並說明所有 3 個 bug
- [ ] Part B：`watch` 正確監聽搜尋框輸入
- [ ] Part B：debounce 300ms 後才觸發
- [ ] Part B：`watchEffect` 自動監聽長度並顯示警告
- [ ] 能說明 watch 與 watchEffect 的核心差異

## Bug 提示（只說明有幾個，不說明是哪幾個）
Starter.vue 中的 bugSection 裡有 3 個 watch 使用上的常見錯誤。

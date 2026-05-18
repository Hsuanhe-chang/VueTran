# Q99 — 綜合題：useLocalStorage + useDebouncedRef

## 對應官方文件
- 章節：Composables — Conventions and Best Practices
- URL：https://vuejs.org/guide/reusability/composables#conventions-and-best-practices

## 題型
功能實作

## 難度
⭐⭐⭐ 進階

## 題目說明
實作兩個實用的 Composable，並組合在一個筆記應用中使用：

### 1. `useLocalStorage(key, defaultValue)`
- 讀取 `localStorage.getItem(key)` 作為初始值（用 `JSON.parse` 反序列化）
- 若 localStorage 沒有該 key，使用 `defaultValue`
- 返回一個 `ref`，當 ref 被修改時自動用 `watch` 同步寫入 localStorage（`JSON.stringify`）

### 2. `useDebouncedRef(value, delay = 500)`
- 接受一個初始值和延遲毫秒數
- 返回一個特殊 ref，其 `setter` 有防抖（debounce）效果：
  - 連續設值時，只有最後一次設值（停止輸入後 delay 毫秒）才真正更新
- 使用 `customRef` 實作（Vue 3 內建 API）

### 組合應用
- 筆記標題：用 `useLocalStorage` 儲存（重新整理後保留）
- 搜尋欄：用 `useDebouncedRef` 過濾筆記清單（輸入停止 300ms 後才觸發過濾）
- 筆記列表：靜態資料，根據 debounced 搜尋詞過濾顯示

## 起手式說明
`Starter.vue` 中已有：
- 靜態筆記資料 `notes`
- 三個 TODO：`useLocalStorage`、`useDebouncedRef`、組合應用

請你完成：
1. 實作 `useLocalStorage(key, defaultValue)`
2. 實作 `useDebouncedRef(value, delay)`（使用 `customRef`）
3. 在元件中使用兩個 Composable，連接到 template

## 驗收標準
- [ ] 筆記標題（useLocalStorage）在重新整理後仍保留輸入的值
- [ ] 搜尋欄輸入時不會每次按鍵就立刻過濾，需停止輸入 300ms 後才更新
- [ ] 過濾後的筆記清單正確顯示符合關鍵字的項目
- [ ] localStorage 中可用開發者工具看到儲存的標題值

## 提示
- `customRef((track, trigger) => ({ get() {}, set(val) {} }))` — 自訂 ref 的讀寫行為
- `clearTimeout` / `setTimeout` — 實現 debounce 效果
- `watch(storageRef, (val) => localStorage.setItem(key, JSON.stringify(val)))` — 監聽並持久化
- `JSON.parse(localStorage.getItem(key) ?? 'null')` — 安全讀取 localStorage

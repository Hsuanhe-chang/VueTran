# Q03 — Getters 與衍生狀態

## 對應官方文件
- 章節：Getters
- URL：https://pinia.vuejs.org/core-concepts/getters

## 題型
從零撰寫

## 難度
⭐ 基礎

## 題目說明
Pinia Getters 是 Store 中的**計算屬性**，特性如下：
- Options Store：用函式接收 `state` 參數（`getters: { fn: state => ... }`）
- Setup Store：用 `computed()` 宣告（`const fn = computed(() => ...)` ）
- Getter 內可用 `this`（Options）或直接引用 ref 呼叫其他 Getter
- 支援**帶參數的 Getter**：回傳一個函式 `state => id => state.items.find(...)` 

本題有一個商品清單 Store，請你撰寫所有標示 TODO 的 Getters。

## 起手式說明
`Starter.vue` 中已有：
- `products` 陣列（state）
- `category` 篩選器（state）
- TODO 空白：需實作 4 個 Getters

請你完成：
1. `totalProducts`：商品總數
2. `filteredProducts`：依 `category` 過濾（`'all'` 時顯示全部）
3. `averageRating`：所有商品評分平均（無商品時回傳 0）
4. `getById`：帶參數的 Getter，回傳一個函式接收 id，找到對應商品

## 驗收標準
- [ ] `totalProducts` 正確顯示商品數
- [ ] 切換分類時 `filteredProducts` 即時更新
- [ ] `averageRating` 計算正確（小數點兩位）
- [ ] `getById('2')` 能找到 id 為 `'2'` 的商品

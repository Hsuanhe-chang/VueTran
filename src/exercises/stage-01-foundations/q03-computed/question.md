# Q03 — Computed Properties 計算屬性

## 對應官方文件
- 章節：Computed Properties
- URL：https://vuejs.org/guide/essentials/computed

## 題型
從零撰寫

## 難度
⭐ 基礎

## 題目說明

`computed()` 用於建立**依賴其他響應式資料衍生的值**。當依賴的資料改變時，computed 值會自動重新計算。

與直接在 template 中寫表達式相比，computed 的優勢：
- **快取（Cache）**：依賴沒變時直接回傳快取值，不重新計算
- **可讀性**：複雜邏輯抽出後 template 更清晰
- **可測試**：邏輯集中在一個函式

## 任務

建立一個**購物車摘要元件**，包含：

1. 用 `ref()` 建立商品列表 `products`（陣列，初始包含 3 個商品，每個有 `name`, `price`, `qty` 屬性）
2. 用 `computed()` 建立 `totalPrice`（所有商品 price × qty 的總和）
3. 用 `computed()` 建立 `totalItems`（所有 qty 的總和）
4. 用 `computed()` 建立 `isCartEmpty`（判斷購物車是否為空，即所有 qty 都為 0）
5. 提供增加 / 減少各商品數量的按鈕

## 驗收標準
- [ ] 商品列表正確顯示（名稱、單價、數量）
- [ ] `totalPrice` 自動計算並隨數量更新
- [ ] `totalItems` 自動計算並隨數量更新
- [ ] `isCartEmpty` 在購物車為空時顯示「購物車是空的」提示
- [ ] 商品數量不可低於 0
- [ ] computed 使用正確（有快取機制，非呼叫函式）

## 提示

```js
import { ref, computed } from 'vue'

const price = ref(100)
const qty = ref(3)

// computed 的值在依賴（price, qty）沒變時會直接回傳快取
const total = computed(() => price.value * qty.value)

// template 中：{{ total }}  ← 不是 total()，computed 像屬性一樣使用
```

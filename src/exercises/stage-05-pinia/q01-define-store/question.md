# Q01 — defineStore 基礎（Options 寫法）

## 對應官方文件
- 章節：Defining a Store（Options Store）
- URL：https://pinia.vuejs.org/core-concepts/

## 題型
填空

## 難度
⭐ 基礎

## 題目說明
Pinia 的 `defineStore` 支援兩種寫法：**Options 風格**與 **Setup 風格**。
本題練習 **Options 風格**，補完以下三個關鍵區塊：

| 區塊 | 說明 |
|---|---|
| `state` | 返回初始狀態物件的函式（必須是函式，才能在多元件間各自獨立） |
| `getters` | 接收 `state` 作為第一參數的計算屬性 |
| `actions` | 修改 state 的方法，可以是同步或非同步 |

Store 內部用 `this` 存取其他狀態與方法（與 Vue Options API 相同概念）。

## 起手式說明
`Starter.vue` 中已有：
- 完整的計數器 UI（按鈕 + 數值顯示）
- `useCounterStore` 的骨架，**TODO 空白**需要補完

請你完成：
1. TODO 1：`state()` 回傳含 `count`（0）和 `history`（空陣列）的物件
2. TODO 2：`getters.doubleCount` 返回 `state.count × 2`
3. TODO 3：`actions.increment`：`count +1`，並把 `'+ 遞增'` 推入 `history`
4. TODO 4：`actions.decrement`：`count -1`，並把 `'- 遞減'` 推入 `history`
5. TODO 5：`actions.reset`：`count` 歸零、`history` 清空

## 驗收標準
- [ ] 點擊「+1」count 增加，history 顯示「+ 遞增」
- [ ] 點擊「-1」count 減少，history 顯示「- 遞減」
- [ ] doubleCount 始終是 count 的 2 倍
- [ ] 點擊「重置」count 歸零，history 清空
- [ ] ESLint 無錯誤

## 提示
- `state` 必須是**函式**（`() => ({ ... })`），不能是物件字面量
- `getters` 中的函式第一個參數是 `state`，不要用 `this`（除非要存取其他 getter）
- `actions` 中用 `this.count`、`this.history` 存取狀態

# Q02 — reactive 與巢狀物件響應性

## 對應官方文件
- 章節：Reactivity Fundamentals — `reactive()`
- URL：https://vuejs.org/guide/essentials/reactivity-fundamentals

## 題型
填空 + 找錯誤

## 難度
⭐ 基礎

## 題目說明

`reactive()` 可以讓整個**物件**變成響應式的。與 `ref()` 不同：
- `ref()` 適合基本型別（string, number, boolean）
- `reactive()` 適合物件、陣列
- `reactive()` 物件中的屬性**不需要** `.value` 就能直接存取

### 重要陷阱（找錯誤練習）
1. **解構賦值會失去響應性**：`const { name } = state` 後，`name` 就不再是響應式的
2. **重新賦值整個 reactive 物件會失去響應性**：`state = newObject` 是錯的
3. `reactive()` 不能包裹基本型別（用 `ref()` 代替）

## 任務

`Starter.vue` 分為兩個部分：

### Part A（填空）
建立一個使用者資料表單：
1. 用 `reactive()` 建立包含 `name`, `age`, `email` 的使用者物件
2. 實作 `birthday()` 函式（年齡 +1）
3. 實作 `resetUser()` 函式（將資料重置回初始值，注意不能直接重新賦值！）

### Part B（找錯誤）
下方 Starter.vue 中有 **2 個 bug**，找出並說明原因。

## 驗收標準
- [ ] Part A：表單資料正確顯示並可修改
- [ ] Part A：`birthday()` 讓年齡正確 +1
- [ ] Part A：`resetUser()` 使用 `Object.assign()` 而非重新賦值
- [ ] Part B：找出所有 bug 並說明為什麼是錯誤的

## 提示

```js
// reactive 基本用法
const state = reactive({ count: 0, name: 'Alice' })
state.count++    // 直接修改屬性，不需要 .value
state.name = 'Bob'

// 重置整個 reactive 物件的正確方式
Object.assign(state, { count: 0, name: 'Alice' })  // ✅ 保留響應性
// state = { count: 0, name: 'Alice' }              // ❌ 失去響應性！
```

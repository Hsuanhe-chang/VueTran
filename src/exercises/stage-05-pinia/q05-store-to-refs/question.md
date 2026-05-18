# Q05 — storeToRefs 保持響應性

## 對應官方文件
- 章節：Destructuring from a Store
- URL：https://pinia.vuejs.org/core-concepts/#destructuring-from-a-store

## 題型
找錯誤

## 難度
⭐ 基礎

## 題目說明
從 Pinia Store 解構時，有一個常見的**響應性陷阱**：

```js
const store = useCounterStore()

// ❌ 直接解構 — count 是普通數值，失去響應性
const { count, name } = store

// ✅ storeToRefs — count 是 ref，保持響應性
const { count, name } = storeToRefs(store)

// ✅ 方法直接從 store 取（不需要 storeToRefs）
const { increment, reset } = store
```

重點：`storeToRefs` 只為**狀態與 getters** 創建 ref，**不處理方法**（方法直接從 store 解構）。

## 起手式說明
`Starter.vue` 中有 **3 個 bug**：
1. Bug A：直接解構 state，失去響應性
2. Bug B：直接解構 getter，失去響應性
3. Bug C：對方法也使用 storeToRefs（不必要且多餘）

請找出並修正所有 bug。

## 驗收標準
- [ ] 計數器能正確響應更新
- [ ] `doubleCount` 始終同步顯示
- [ ] 方法直接從 store 解構（不透過 storeToRefs）
- [ ] 理解哪些屬性需要 storeToRefs，哪些不需要

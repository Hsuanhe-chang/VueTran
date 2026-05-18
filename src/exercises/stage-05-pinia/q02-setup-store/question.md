# Q02 — Setup Store（Composition API 寫法）

## 對應官方文件
- 章節：Defining a Store（Setup Store）
- URL：https://pinia.vuejs.org/core-concepts/#setup-stores

## 題型
重構

## 難度
⭐⭐ 中級

## 題目說明
Pinia 的 **Setup Store** 寫法和 Vue 的 `<script setup>` 非常相似：
- `ref()` → state
- `computed()` → getter
- 一般函式 → action
- 最後 `return` 要公開的所有屬性與方法

本題提供一個已完成的 **Options Store**，
請將其**重構**為等效的 **Setup Store** 寫法。

## 對應關係

| Options 寫法 | Setup 寫法 |
|---|---|
| `state: () => ({ count: 0 })` | `const count = ref(0)` |
| `getters: { double: s => s.count * 2 }` | `const double = computed(() => count.value * 2)` |
| `actions: { increment() { this.count++ } }` | `function increment() { count.value++ }` |
| （自動公開） | `return { count, double, increment }` |

## 起手式說明
`Starter.vue` 中已有：
- 左側：已完成的 Options Store（參考用，**不要修改**）
- 右側：需要重構的 Setup Store 骨架（TODO 空白需補完）

## 驗收標準
- [ ] Setup Store 的 `count` 與 Options Store 的 `count` 行為一致
- [ ] `doubleCount` 始終是 `count` 的 2 倍
- [ ] `increment` / `decrement` / `reset` 功能正常
- [ ] `return` 中包含所有需要公開的屬性與方法
- [ ] 兩個 Store 的 UI 同步顯示（驗證同一個 Pinia 實例下各自獨立）

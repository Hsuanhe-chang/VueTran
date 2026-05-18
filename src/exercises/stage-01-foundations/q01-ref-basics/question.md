# Q01 — ref 與響應式基礎

## 對應官方文件
- 章節：Reactivity Fundamentals — `ref()`
- URL：https://vuejs.org/guide/essentials/reactivity-fundamentals

## 題型
填空 + 從零撰寫

## 難度
⭐ 基礎

## 題目說明

Vue 3 Composition API 使用 `ref()` 建立**響應式資料**。當 ref 的值改變時，Vue 會自動更新使用到該值的 template。

在 `<script setup>` 中，`ref()` 的值必須透過 `.value` 存取；在 `<template>` 中 Vue 會自動解包，**不需要** `.value`。

## 任務

在 `Starter.vue` 中，完成一個計數器元件：

1. 從 `vue` import `ref`
2. 使用 `ref(0)` 建立計數器 `count`
3. 實作三個函式：`increment()`（+1）、`decrement()`（-1）、`reset()`（歸零）
4. 在 template 中顯示 `count`（**不要**加 `.value`）
5. 為三個按鈕綁定對應的點擊事件

## 驗收標準
- [ ] 點擊「+1」後計數器增加 1
- [ ] 點擊「-1」後計數器減少 1
- [ ] 點擊「重置」後計數器回到 0
- [ ] `ref()` 使用正確（在 script 中透過 `.value` 操作）
- [ ] template 中直接寫 `{{ count }}`（無 `.value`）

## 提示

```js
// ref 的基本用法
import { ref } from 'vue'

const message = ref('Hello')     // 建立響應式字串
console.log(message.value)       // 在 JS 中讀取：加 .value
message.value = 'World'          // 在 JS 中修改：加 .value
// <template> 中：{{ message }}  // template 中：不加 .value
```

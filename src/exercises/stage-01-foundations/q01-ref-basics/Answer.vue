<script setup lang="ts">
/**
 * Q01 — 參考答案：ref 與響應式基礎
 *
 * 核心重點：
 *   1. 用 ref() 建立響應式基本型別值
 *   2. 在 <script setup> 中透過 .value 讀寫
 *   3. 在 <template> 中 Vue 自動解包，直接寫變數名即可
 *   4. TypeScript 會自動推論 ref(0) 的型別為 Ref<number>
 */

// 步驟 1：從 'vue' import ref
//         ref 是 Vue 3 Composition API 中建立響應式資料的核心函式
import { ref } from 'vue'

// 步驟 2：建立初始值為 0 的響應式計數器
//         ref() 會回傳一個 { value: 0 } 的響應式物件
//         TypeScript 型別：Ref<number>
//         當 count.value 改變時，Vue 會自動重新渲染使用 count 的 template
const count = ref(0)

// 步驟 3：increment — 讓計數器加 1
//         在 script 中必須透過 .value 來修改 ref 的值
function increment(): void {
  count.value++
}

// 步驟 4：decrement — 讓計數器減 1
function decrement(): void {
  count.value--
}

// 步驟 5：reset — 將計數器歸零
function reset(): void {
  count.value = 0
}
</script>

<template>
  <div class="counter-demo">
    <h3>⚡ 計數器練習（參考答案）</h3>

    <!--
      步驟 6：在 template 中顯示 count
      Vue 會自動「解包」ref，不需要寫 count.value
      直接寫 {{ count }} 即可
    -->
    <p class="count-display">
      目前計數：<strong>{{ count }}</strong>
    </p>

    <div class="btn-group">
      <!--
        步驟 7：用 @click 綁定事件處理函式
        @click 是 v-on:click 的縮寫
      -->
      <button class="btn btn-outline" @click="decrement">－1</button>
      <button class="btn btn-outline reset-btn" @click="reset">重置</button>
      <button class="btn btn-primary" @click="increment">＋1</button>
    </div>
  </div>
</template>

<style scoped>
.counter-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  /* 答案用綠色邊框區分 */
  border: 2px solid var(--color-primary);
}

.count-display {
  font-size: 1.5rem;
  color: var(--color-text-muted);
}

.count-display strong {
  font-size: 3rem;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.btn-group {
  display: flex;
  gap: 12px;
}

.reset-btn {
  border-color: var(--color-text-muted);
  color: var(--color-text-muted);
}
</style>

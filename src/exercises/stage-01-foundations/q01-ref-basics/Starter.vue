<script setup lang="ts">
/**
 * Q01 — ref 與響應式基礎
 * 任務：讓下方的計數器按鈕正常運作
 *
 * 現況：import 和變數宣告已完成，但函式邏輯尚未實作。
 * 請填入每個 TODO 內的程式碼。
 */

// ✅ import 已完成
import { ref } from 'vue'

// ✅ count 已用 ref(0) 建立
//    TypeScript 會自動推論 count 的型別為 Ref<number>
//    注意：在 <script setup> 中，讀寫 ref 的值需要加 .value
const count = ref(0)

// TODO 1: 實作 increment — 讓 count 加 1
//         提示：count.value = ?
function increment(): void {
  // 請在此填入：count.value++
}

// TODO 2: 實作 decrement — 讓 count 減 1
function decrement(): void {
  // 請在此填入：count.value--
}

// TODO 3: 實作 reset — 將 count 設回 0
function reset(): void {
  // 請在此填入：count.value = 0
}
</script>

<template>
  <div class="counter-demo">
    <h3>⚡ 計數器練習</h3>

    <!--
      ✅ count 已正確顯示（template 中不需要 .value，Vue 自動解包）
      按下按鈕後數字沒有改變 → 表示函式邏輯還沒實作完成
    -->
    <p class="count-display">
      目前計數：<strong>{{ count }}</strong>
    </p>

    <div class="btn-group">
      <!--
        ✅ 事件已綁定：@click 會在點擊時呼叫對應函式
        但因為函式邏輯是空的，點擊後沒有效果
        → 去 <script setup> 填入函式內容！
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
  border: 2px dashed var(--color-border);
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

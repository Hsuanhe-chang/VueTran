<script setup>
/** Q09 — 參考答案：事件處理與修飾符 */
import { ref } from 'vue'

const clickLog = ref('')
const bubbleLog = ref('')
const formLog = ref('')
const inputLog = ref('')

function handleClick(event) {
  clickLog.value = `被點擊！座標：(${event.clientX}, ${event.clientY})`
}

function handleParentClick() {
  bubbleLog.value = '父層被點擊'
}

function handleChildClick() {
  bubbleLog.value = '子元素被點擊（已阻止冒泡，父層未收到事件）'
}

function handleFormSubmit() {
  formLog.value = '表單提交成功（頁面未重新整理！）'
}

function handleEnterKey(event) {
  inputLog.value = `Enter！輸入值是：「${event.target.value}」`
}
</script>

<template>
  <div class="events-demo answer">
    <h3>🖱️ 事件處理練習（參考答案）</h3>

    <!-- 基本點擊：傳入 $event 物件 -->
    <section class="demo-section">
      <h4>基本點擊事件</h4>
      <button class="btn btn-primary" @click="handleClick($event)">點擊我</button>
      <p class="log">{{ clickLog || '尚未點擊' }}</p>
    </section>

    <!-- .stop 阻止冒泡：父層有 @click，子元素加 @click.stop -->
    <section class="demo-section">
      <h4>事件冒泡（.stop 修飾符）</h4>
      <div class="parent-box" @click="handleParentClick">
        父層區域（點我會觸發父層事件）
        <!-- @click.stop 等同於在 handler 中呼叫 event.stopPropagation() -->
        <button class="btn btn-outline child-btn" @click.stop="handleChildClick">
          子按鈕（阻止冒泡）
        </button>
      </div>
      <p class="log">{{ bubbleLog || '尚未點擊' }}</p>
    </section>

    <!-- .prevent 阻止表單預設行為（避免頁面刷新） -->
    <section class="demo-section">
      <h4>阻止表單提交（.prevent 修飾符）</h4>
      <form @submit.prevent="handleFormSubmit">
        <input type="text" placeholder="隨便輸入..." class="search-input" />
        <button type="submit" class="btn btn-primary">提交</button>
      </form>
      <p class="log">{{ formLog || '尚未提交' }}</p>
    </section>

    <!-- @keyup.enter：只在按下 Enter 時觸發 -->
    <section class="demo-section">
      <h4>按鍵修飾符（@keyup.enter）</h4>
      <input type="text" placeholder="輸入文字後按 Enter..." class="search-input" @keyup.enter="handleEnterKey" />
      <p class="log">{{ inputLog || '按 Enter 觸發' }}</p>
    </section>
  </div>
</template>

<style scoped>
.events-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.log { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-primary); padding: 8px; background: var(--color-bg); border-radius: var(--radius-sm); }
.parent-box { padding: var(--space-md); background: rgba(66,184,131,0.08); border: 2px dashed var(--color-primary); border-radius: var(--radius-md); cursor: pointer; display: flex; flex-direction: column; gap: var(--space-sm); }
.child-btn { align-self: flex-start; }
.search-input { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--font-size-base); width: 100%; }
form { display: flex; gap: var(--space-sm); }
form input { flex: 1; }
</style>

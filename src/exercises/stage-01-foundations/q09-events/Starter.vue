<script setup lang="ts">
/** Q09 — 事件處理與修飾符（從零撰寫）
 *  現況：UI 骨架已完成，你需要實作函式並在 template 中加上正確的事件綁定
 */
import { ref } from 'vue'

const clickLog = ref('')
const bubbleLog = ref('')
const formLog = ref('')
const inputLog = ref('')

// TODO 1: 實作 handleClick(event)
//         在 clickLog 顯示「被點擊！座標：(x, y)」
//         提示：event.clientX, event.clientY
function handleClick(event: MouseEvent): void {
  // 請實作這裡
}

// TODO 2: 實作 handleParentClick()
//         在 bubbleLog 顯示「父層被點擊」
function handleParentClick() {
  // 請實作這裡
}

// TODO 3: 實作 handleChildClick()
//         在 bubbleLog 顯示「子元素被點擊（已阻止冒泡）」
//         注意：在 template 中要用 @click.stop 阻止冒泡
function handleChildClick() {
  // 請實作這裡
}

// TODO 4: 實作 handleFormSubmit()
//         在 formLog 顯示「表單提交成功（頁面未重新整理）」
//         注意：在 template 中要用 @submit.prevent 阻止預設行為
function handleFormSubmit() {
  // 請實作這裡
}

// TODO 5: 實作 handleEnterKey(event)
//         在 inputLog 顯示目前的輸入值
//         提示：event.target.value
function handleEnterKey(event: KeyboardEvent): void {
  // 請實作這裡
}
</script>

<template>
  <div class="events-demo">
    <h3>🖱️ 事件處理練習</h3>

    <!-- 1. 基本點擊事件 -->
    <section class="demo-section">
      <h4>基本點擊事件</h4>
      <!--
        TODO: 加上 @click，並傳入 $event 物件給 handleClick
        語法：@click="handleClick($event)"
      -->
      <button class="btn btn-primary">點擊我（加上 @click）</button>
      <p class="log">{{ clickLog || '尚未點擊' }}</p>
    </section>

    <!-- 2. 事件冒泡與 .stop -->
    <section class="demo-section">
      <h4>事件冒泡（.stop 修飾符）</h4>
      <!--
        TODO: 父層加 @click="handleParentClick"
              子按鈕加 @click.stop="handleChildClick"
      -->
      <div class="parent-box">
        父層區域（加上 @click）
        <button class="btn btn-outline child-btn">子按鈕（加上 @click.stop）</button>
      </div>
      <p class="log">{{ bubbleLog || '尚未點擊' }}</p>
    </section>

    <!-- 3. 表單 .prevent -->
    <section class="demo-section">
      <h4>阻止表單提交（.prevent 修飾符）</h4>
      <!--
        TODO: 在 form 上加 @submit.prevent="handleFormSubmit"
      -->
      <form>
        <input type="text" placeholder="隨便輸入..." class="search-input" />
        <button type="submit" class="btn btn-primary">提交</button>
      </form>
      <p class="log">{{ formLog || '尚未提交' }}</p>
    </section>

    <!-- 4. 按鍵修飾符 -->
    <section class="demo-section">
      <h4>按鍵修飾符（@keyup.enter）</h4>
      <!--
        TODO: 在 input 上加 @keyup.enter="handleEnterKey"
      -->
      <input type="text" placeholder="輸入文字後按 Enter..." class="search-input" />
      <p class="log">{{ inputLog || '按 Enter 觸發' }}</p>
    </section>
  </div>
</template>

<style scoped>
.events-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.log { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-primary); padding: 8px; background: var(--color-bg); border-radius: var(--radius-sm); }
.parent-box { padding: var(--space-md); background: rgba(66,184,131,0.08); border: 2px dashed var(--color-primary); border-radius: var(--radius-md); cursor: pointer; display: flex; flex-direction: column; gap: var(--space-sm); }
.child-btn { align-self: flex-start; }
.search-input { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--font-size-base); width: 100%; }
form { display: flex; gap: var(--space-sm); }
form input { flex: 1; }
</style>

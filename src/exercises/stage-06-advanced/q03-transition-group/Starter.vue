<script setup lang="ts">
/** Q03 — TransitionGroup 列表動畫（從零撰寫）
 *
 *  TransitionGroup 與 Transition 的差異：
 *  - 適用於 v-for 列表（每個子元素都需要 key）
 *  - 支援「移動動畫」：{name}-move CSS 類別
 *  - 離開動畫期間元素需設 position: absolute，讓其他元素能平滑填補
 *
 *  TODO：
 *  1. 把 <ul> 換成 <TransitionGroup tag="ul" name="list">
 *  2. 在 <style scoped> 補齊所有 .list-xxx 動畫 CSS
 */
import { ref } from 'vue'

let nextId = 5
const items = ref([
  { id: 1, text: 'Vue 3 Composition API' },
  { id: 2, text: 'Pinia 狀態管理' },
  { id: 3, text: 'Vue Router 4' },
  { id: 4, text: 'Vite 建置工具' },
])

function addItem() {
  const labels = ['TypeScript', 'Tailwind CSS', 'Vitest', 'Nuxt 3', 'VueUse']
  const label  = labels[(nextId - 5) % labels.length]
  items.value.unshift({ id: nextId++, text: label })
}

function removeItem(id: number): void {
  items.value = items.value.filter(i => i.id !== id)
}

function shuffleItems() {
  // Fisher-Yates shuffle — 展示移動動畫
  const arr = [...items.value]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  items.value = arr
}
</script>

<template>
  <div class="transition-group-demo">
    <h3>✨ Q03 — TransitionGroup 列表動畫（練習）</h3>

    <section class="demo-section">
      <h4>學習清單</h4>
      <div class="toolbar">
        <button class="btn btn-sm" @click="addItem">＋ 新增項目</button>
        <button class="btn btn-sm btn-outline" @click="shuffleItems">🔀 打亂順序</button>
      </div>

      <!-- TODO 1：把下面的 <ul> 改成 <TransitionGroup tag="ul" name="list"> -->
      <!-- 注意：每個 <li> 已經有 :key，這是 TransitionGroup 的必要條件 -->
      <ul class="item-list">
        <li
          v-for="item in items"
          :key="item.id"
          class="item-row"
        >
          <span class="item-id">#{{ item.id }}</span>
          <span class="item-text">{{ item.text }}</span>
          <button class="btn-remove" @click="removeItem(item.id)">✕</button>
        </li>
      </ul>
    </section>

    <!-- ── CSS 類別提示 ── -->
    <section class="demo-section">
      <h4>TransitionGroup 動畫 CSS 提示</h4>
      <pre v-pre class="code-block">/* name="list" 的類別 */

/* 進入動畫 */
.list-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.list-enter-from   { opacity: 0; transform: translateX(-30px); }

/* 離開動畫 */
.list-leave-active { transition: opacity 0.3s ease; position: absolute; }
                   /*             ↑ position: absolute 讓其他元素能平滑填補 */
.list-leave-to     { opacity: 0; transform: translateX(30px); }

/* 移動動畫（其他元素補位）*/
.list-move         { transition: transform 0.4s ease; }</pre>
    </section>
  </div>
</template>

<style scoped>
.transition-group-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.toolbar { display: flex; gap: 6px; }
.item-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; position: relative; }
.item-row { display: flex; align-items: center; gap: var(--space-sm); padding: 10px 14px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.item-id { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-muted); min-width: 28px; }
.item-text { flex: 1; font-size: var(--font-size-sm); font-weight: 500; }
.btn-remove { width: 24px; height: 24px; border: none; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 0.8rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.btn-remove:hover { background: #fee2e2; color: #dc2626; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }

/* TODO 2：補齊以下動畫 CSS */
/* .list-enter-active { ... } */
/* .list-enter-from   { ... } */
/* .list-leave-active { ... } */
/* .list-leave-to     { ... } */
/* .list-move         { ... } */
</style>

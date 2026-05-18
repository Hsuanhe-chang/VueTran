<script setup>
/** Q03 — TransitionGroup 列表動畫（解答）
 *
 *  關鍵重點：
 *  1. TransitionGroup 需要 tag 屬性（或在 Vue 3.2+ 可省略，預設不渲染外層）
 *  2. 每個子元素必須有唯一 :key
 *  3. leave-active 需要 position: absolute → 讓其他元素平滑移動（list-move 才有效）
 *  4. list-move 搭配 transition: transform 實現重排動畫
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

function removeItem(id) {
  items.value = items.value.filter(i => i.id !== id)
}

function shuffleItems() {
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
    <h3>✨ Q03 — TransitionGroup 列表動畫（解答）</h3>

    <section class="demo-section">
      <h4>學習清單（帶動畫）</h4>
      <div class="toolbar">
        <button class="btn btn-sm" @click="addItem">＋ 新增項目</button>
        <button class="btn btn-sm btn-outline" @click="shuffleItems">🔀 打亂順序</button>
      </div>

      <!-- ✅ 使用 TransitionGroup 包住 v-for 列表 -->
      <!-- tag="ul" 讓 TransitionGroup 渲染為 <ul> 標籤 -->
      <TransitionGroup tag="ul" name="list" class="item-list">
        <li
          v-for="item in items"
          :key="item.id"
          class="item-row"
        >
          <span class="item-id">#{{ item.id }}</span>
          <span class="item-text">{{ item.text }}</span>
          <button class="btn-remove" @click="removeItem(item.id)">✕</button>
        </li>
      </TransitionGroup>
    </section>

    <!-- ── 完整 CSS 說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整 TransitionGroup CSS</h4>
      <pre v-pre class="code-block">/* 進入：從左側滑入 */
.list-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.list-enter-from   { opacity: 0; transform: translateX(-30px); }

/* 離開：向右滑出 + position: absolute 讓位 */
.list-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: absolute;  /* ← 讓正在離開的元素不佔位，其他元素才能平移 */
  width: 100%;         /* ← 配合 position: absolute 保持寬度 */
}
.list-leave-to     { opacity: 0; transform: translateX(30px); }

/* 移動動畫：其他元素補位（打亂順序、刪除後的重排） */
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

/* ── TransitionGroup 動畫 ────────────────────────────── */
/* 進入：從左側滑入 */
.list-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.list-enter-from   { opacity: 0; transform: translateX(-30px); }

/* 離開：向右淡出，position:absolute 讓其他元素可以移動填補 */
.list-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: absolute;
  width: calc(100% - 32px);
}
.list-leave-to     { opacity: 0; transform: translateX(30px); }

/* 移動動畫：重排時平滑過渡 */
.list-move         { transition: transform 0.4s ease; }
</style>

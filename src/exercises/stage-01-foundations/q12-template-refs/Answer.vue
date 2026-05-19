<script setup lang="ts">
/** Q12 — 參考答案：Template Refs */
import { ref, useTemplateRef, onMounted } from 'vue'

const searchText = ref('')
const inputWidth = ref(0)

// useTemplateRef('searchInput') 的參數字串必須與 template 中 ref="searchInput" 完全一致
// 返回的 ref 在 onMounted 之前為 null，因為 DOM 還沒建立
const inputEl = useTemplateRef('searchInput')

// onMounted：DOM 完全插入後才能操作 DOM 元素
onMounted(() => {
  // 自動聚焦輸入框（用 ?. 避免 null 報錯）
  inputEl.value?.focus()

  // 讀取真實 DOM 的 offsetWidth（包含 padding，不含 margin）
  inputWidth.value = inputEl.value?.offsetWidth ?? 0
})

// 清空輸入並重新聚焦
function clearAndFocus() {
  searchText.value = ''
  // 下一個 tick 後聚焦（確保 DOM 已更新）
  inputEl.value?.focus()
}
</script>

<template>
  <div class="template-ref-demo answer">
    <h3>🎯 Template Refs 練習（參考答案）</h3>

    <div class="search-box">
      <!--
        ref="searchInput" 的字串必須與 useTemplateRef('searchInput') 一致
        Vue 會在掛載後自動將這個 DOM 元素填入 inputEl.value
      -->
      <input
        ref="searchInput"
        v-model="searchText"
        type="text"
        placeholder="自動聚焦的搜尋框..."
        class="search-input"
      />
      <button class="btn btn-outline" @click="clearAndFocus">清除</button>
    </div>

    <div class="info-card card">
      <p>目前輸入：<code>{{ searchText || '（空）' }}</code></p>
      <p>輸入框寬度：<code>{{ inputWidth }}px</code>（透過 DOM API 讀取）</p>
    </div>
  </div>
</template>

<style scoped>
.template-ref-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
.search-box { display: flex; gap: var(--space-sm); }
.search-input { flex: 1; padding: 10px 14px; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-lg); }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.info-card { display: flex; flex-direction: column; gap: 8px; }
</style>

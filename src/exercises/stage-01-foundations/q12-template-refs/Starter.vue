<script setup>
/** Q12 — Template Refs（從零撰寫）
 *  現況：響應式資料已準備，你需要用 useTemplateRef 取得 DOM 元素
 */
import { ref, useTemplateRef, onMounted } from 'vue'

const searchText = ref('')
const inputWidth = ref(0)

// TODO 1: 用 useTemplateRef('searchInput') 建立 inputEl
//         注意：字串參數必須與 template 中 ref="searchInput" 完全一致
const inputEl = useTemplateRef('searchInput')

// TODO 2: 在 onMounted 中：
//   a. 讓搜尋框自動聚焦：inputEl.value?.focus()
//   b. 讀取並存儲寬度：inputWidth.value = inputEl.value?.offsetWidth ?? 0
onMounted(() => {
  // 請實作這裡（自動聚焦 + 讀取寬度）
})

// TODO 3: 實作 clearAndFocus()
//   a. 清空 searchText.value = ''
//   b. 重新聚焦：inputEl.value?.focus()
function clearAndFocus() {
  // 請實作這裡
}
</script>

<template>
  <div class="template-ref-demo">
    <h3>🎯 Template Refs 練習</h3>

    <div class="search-box">
      <!--
        ✅ ref="searchInput" 已加好
        這讓 useTemplateRef('searchInput') 能在 onMounted 後取得這個元素
      -->
      <input
        ref="searchInput"
        v-model="searchText"
        type="text"
        placeholder="實作 onMounted 後會自動聚焦..."
        class="search-input"
      />

      <!-- ✅ 事件已綁定，但 clearAndFocus 的邏輯需要你實作 -->
      <button class="btn btn-outline" @click="clearAndFocus">清除</button>
    </div>

    <div class="info-card card">
      <p>目前輸入：<code>{{ searchText || '（空）' }}</code></p>
      <p>輸入框寬度：<code>{{ inputWidth }}px</code>（完成 onMounted 後會顯示）</p>
    </div>
  </div>
</template>

<style scoped>
.template-ref-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.search-box { display: flex; gap: var(--space-sm); }
.search-input { flex: 1; padding: 10px 14px; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-lg); }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.info-card { display: flex; flex-direction: column; gap: 8px; }
</style>

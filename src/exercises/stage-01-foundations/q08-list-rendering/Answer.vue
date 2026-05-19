<script setup lang="ts">
/**
 * Q08 — 參考答案：v-for 列表渲染
 *
 * Bug 解說：
 *   Bug 1：用 fruit 字串當 key，若列表中有重複水果名稱就會衝突
 *          且字串不如 id 穩定（順序改變時 Vue 可能誤判 key 相同）
 *          最佳實踐：資料中加入唯一 id，用 :key="item.id"
 *
 *   Bug 2：完全缺少 :key
 *          沒有 key 時，Vue 在刪除/排序時可能復用錯誤的 DOM 節點
 *          例如：刪除第 2 項後，第 3 項的 DOM 可能還保留第 2 項的內容
 */
import { ref } from 'vue'

const students = ref([
  { id: 1, name: '王小明', score: 92 },
  { id: 2, name: '李小花', score: 87 },
  { id: 3, name: '張大偉', score: 78 },
  { id: 4, name: '陳美玲', score: 95 },
])

function removeStudent(id: number): void {
  students.value = students.value.filter(s => s.id !== id)
}
</script>

<template>
  <div class="list-demo answer">
    <h3>📋 列表渲染練習（參考答案）</h3>

    <section class="demo-section">
      <h4>Part A — 學生名單（正確寫法）</h4>
      <ul class="student-list">
        <!--
          v-for="(student, index) in students" 同時取 item 和 index
          :key="student.id" 使用唯一 id，而非 index
        -->
        <li v-for="(student, index) in students" :key="student.id" class="student-item">
          <span class="rank">{{ index + 1 }}.</span>
          <span class="name">{{ student.name }}</span>
          <span class="score">{{ student.score }} 分</span>
          <button class="btn btn-outline remove-btn" @click="removeStudent(student.id)">刪除</button>
        </li>
      </ul>
    </section>

    <section class="demo-section">
      <h4>Part B — Bug 解說</h4>
      <dl>
        <dt>Bug 1：用字串當 key</dt>
        <dd>若有重複值則 key 衝突；字串 key 在資料排序後可能不穩定。<br/>應使用唯一 id。</dd>
        <dt>Bug 2：缺少 :key</dt>
        <dd>無 key 時 Vue 使用「就地更新」策略，刪除/插入可能讓 DOM 對應錯誤。<br/>永遠記得加 :key！</dd>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.list-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { margin-bottom: var(--space-md); color: var(--color-secondary); }
.student-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.student-item { display: flex; align-items: center; gap: var(--space-md); padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.rank { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 2ch; }
.name { flex: 1; font-weight: 500; }
.score { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }
.remove-btn { margin-left: auto; padding: 2px 10px; font-size: var(--font-size-sm); color: #ef4444; border-color: #ef4444; }
dt { font-family: var(--font-mono); font-weight: 600; margin-top: var(--space-md); }
dd { color: var(--color-text-muted); padding-left: var(--space-md); line-height: 1.8; }
</style>

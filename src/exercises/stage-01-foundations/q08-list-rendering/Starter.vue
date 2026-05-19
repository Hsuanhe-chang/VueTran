<script setup lang="ts">
/** Q08 — v-for 列表渲染（填空 + 找錯誤） */
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

const fruits = ref(['蘋果', '香蕉', '芒果', '葡萄'])
</script>

<template>
  <div class="list-demo">
    <h3>📋 列表渲染練習</h3>

    <!-- Part A：填空 -->
    <section class="demo-section">
      <h4>Part A — 學生名單</h4>
      <ul class="student-list">
        <!--
          TODO: 在 li 上加上：
            v-for="(student, index) in students"
            :key="student.id"
          （注意：不要用 index 當 key！）
        -->
        <li class="student-item">
          <!--
            TODO: 把下面三個 '???' 改為正確的顯示：
              - index + 1（序號）
              - student.name
              - student.score
          -->
          <span class="rank">{{ '???' }}.</span>
          <span class="name">{{ '???' }}</span>
          <span class="score">{{ '???' }} 分</span>
          <button class="btn btn-outline remove-btn" @click="removeStudent(student.id)">刪除</button>
        </li>
      </ul>
      <p class="hint">完成 v-for 後，按刪除按鈕測試 :key 的效果</p>
    </section>

    <!-- Part B：找錯誤（2 個 bug） -->
    <section class="demo-section bug-section">
      <h4>Part B — 找出 2 個 Bug</h4>

      <!-- Bug 1：key 用了字串，有什麼風險？ -->
      <ul>
        <li v-for="fruit in fruits" :key="fruit">{{ fruit }}</li>
      </ul>
      <p class="hint">Bug 1：用字串 <code>fruit</code> 當 key 有什麼問題？</p>

      <!-- Bug 2：缺少 :key -->
      <ul>
        <li v-for="(student, index) in students">{{ student.name }}</li>
      </ul>
      <p class="hint">Bug 2：這個 v-for 缺少什麼？刪除後會發生什麼？</p>
    </section>
  </div>
</template>

<style scoped>
.list-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { margin-bottom: var(--space-md); color: var(--color-secondary); }
.student-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.student-item { display: flex; align-items: center; gap: var(--space-md); padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.rank { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 2ch; }
.name { flex: 1; font-weight: 500; }
.score { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }
.remove-btn { margin-left: auto; padding: 2px 10px; font-size: var(--font-size-sm); color: #ef4444; border-color: #ef4444; }
.bug-section { border-color: #fca5a5; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-sm); }
</style>

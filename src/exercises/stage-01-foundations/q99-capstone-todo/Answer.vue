<script setup lang="ts">
/**
 * Q99 — 參考答案：Todo List 完整實作
 *
 * 整合了 Stage 1 的所有核心概念：
 *   - ref() — todos 陣列、輸入值、篩選狀態
 *   - computed() — filteredTodos、remainingCount
 *   - v-model — 輸入框雙向綁定
 *   - v-for + :key — 列表渲染
 *   - v-if / v-else / v-show — 條件顯示
 *   - @click / @keyup.enter — 事件處理
 *   - :class — 動態樣式（completed 狀態）
 */
import { ref, computed } from 'vue'

// ─── State ─────────────────────────────────────────────
// 待辦清單：每個 todo 有唯一 id、文字內容、完成狀態、建立時間
const todos = ref([
  { id: 1, text: '學完 Q01 ref 基礎', completed: true, createdAt: new Date() },
  { id: 2, text: '練習 Q02 reactive', completed: false, createdAt: new Date() },
])

// 新增輸入框的值
const newTodoText = ref('')

// 篩選狀態：'all' | 'active' | 'completed'
const filter = ref<'all' | 'active' | 'completed'>('all')

// 全局唯一 ID 計數器（避免用陣列長度，因為刪除後長度會變）
let nextId = 3

// ─── Computed ──────────────────────────────────────────
// 根據篩選狀態過濾 todos
const filteredTodos = computed(() => {
  // 建立篩選函式對應表，讓代碼更清晰
  const filters = {
    all: () => todos.value,
    active: () => todos.value.filter((t) => !t.completed),
    completed: () => todos.value.filter((t) => t.completed),
  }
  return filters[filter.value]()
})

// 未完成的數量
const remainingCount = computed(() => todos.value.filter((t) => !t.completed).length)

// ─── Actions ───────────────────────────────────────────
// 新增 todo：輸入為空時不新增
function addTodo() {
  const text = newTodoText.value.trim()
  if (!text) return  // 早期返回，避免巢狀

  todos.value.push({
    id: nextId++,
    text,
    completed: false,
    createdAt: new Date(),
  })

  // 新增後清空輸入框
  newTodoText.value = ''
}

// 切換 todo 的完成狀態
function toggleTodo(id: number): void {
  const todo = todos.value.find((t) => t.id === id)
  if (todo) todo.completed = !todo.completed
}

// 刪除指定 id 的 todo
function deleteTodo(id: number): void {
  todos.value = todos.value.filter((t) => t.id !== id)
}

// 清除所有已完成的 todo
function clearCompleted() {
  todos.value = todos.value.filter((t) => !t.completed)
}
</script>

<template>
  <div class="todo-app answer">
    <h2 class="todo-title">📝 My Todo List（參考答案）</h2>

    <!-- 新增輸入區 -->
    <div class="todo-input-row">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="有什麼要做的事？按 Enter 新增"
        class="todo-input"
        @keyup.enter="addTodo"
      />
      <!-- :disabled 在輸入為空時禁用按鈕 -->
      <button class="btn btn-primary" :disabled="!newTodoText.trim()" @click="addTodo">新增</button>
    </div>

    <!-- 篩選 Tab -->
    <nav class="filter-tabs">
      <button
        v-for="tab in ([
          { key: 'all', label: '全部' },
          { key: 'active', label: '未完成' },
          { key: 'completed', label: '已完成' },
        ] as const)"
        :key="tab.key"
        class="filter-tab"
        :class="{ 'filter-tab-active': filter === tab.key }"
        @click="filter = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- 空狀態：用 v-if 判斷過濾後的結果 -->
    <div v-if="filteredTodos.length === 0" class="empty-state">
      <p>{{ filter === 'all' ? '還沒有待辦事項，新增一個吧！' : '沒有符合條件的待辦' }}</p>
    </div>

    <!-- Todo 列表：:key 使用 todo.id（唯一且穩定） -->
    <ul v-else class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ 'todo-completed': todo.completed }"
      >
        <span class="todo-text" @click="toggleTodo(todo.id)">
          {{ todo.completed ? '✅' : '⬜' }} {{ todo.text }}
        </span>
        <button class="todo-delete" @click="deleteTodo(todo.id)">✕</button>
      </li>
    </ul>

    <!-- 底部統計：只有 todos 不為空才顯示 -->
    <footer v-if="todos.length > 0" class="todo-footer">
      <span class="remaining-count">剩餘 {{ remainingCount }} 項未完成</span>
      <!-- 只有有已完成項目時才顯示清除按鈕 -->
      <button
        v-if="todos.some((t) => t.completed)"
        class="btn btn-outline clear-btn"
        @click="clearCompleted"
      >
        清除已完成
      </button>
    </footer>
  </div>
</template>

<style scoped>
.todo-app { max-width: 600px; margin: 0 auto; padding: var(--space-lg); background: var(--color-bg-card); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
.todo-title { text-align: center; margin-bottom: var(--space-lg); color: var(--color-secondary); }
.todo-input-row { display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); }
.todo-input { flex: 1; padding: 10px 14px; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); font-family: inherit; transition: border-color var(--transition-fast); }
.todo-input:focus { outline: none; border-color: var(--color-primary); }
.filter-tabs { display: flex; gap: 4px; margin-bottom: var(--space-md); background: var(--color-bg); padding: 4px; border-radius: var(--radius-md); }
.filter-tab { flex: 1; padding: 6px; border-radius: var(--radius-sm); font-size: var(--font-size-sm); cursor: pointer; transition: all var(--transition-fast); color: var(--color-text-muted); }
.filter-tab-active { background: white; color: var(--color-primary); font-weight: 600; box-shadow: var(--shadow-sm); }
.empty-state { text-align: center; padding: var(--space-xl); color: var(--color-text-muted); }
.todo-list { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: var(--space-md); }
.todo-item { display: flex; align-items: center; gap: var(--space-sm); padding: 12px var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); transition: all var(--transition-fast); }
.todo-completed .todo-text { text-decoration: line-through; color: var(--color-text-muted); }
.todo-text { flex: 1; cursor: pointer; user-select: none; }
.todo-delete { color: var(--color-text-muted); font-size: 0.8rem; padding: 4px 6px; border-radius: var(--radius-sm); transition: all var(--transition-fast); cursor: pointer; }
.todo-delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.todo-footer { display: flex; align-items: center; justify-content: space-between; padding-top: var(--space-md); border-top: 1px solid var(--color-border); }
.remaining-count { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.clear-btn { font-size: var(--font-size-sm); padding: 4px 12px; }
</style>

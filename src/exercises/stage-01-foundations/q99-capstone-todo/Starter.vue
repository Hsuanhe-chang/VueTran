<script setup>
/**
 * Q99 — 綜合題：Todo List 完整實作
 *
 * 這是 Stage 1 的綜合題，請自己從頭完成所有功能。
 * Template 骨架已提供，請撰寫 <script setup> 的所有邏輯。
 *
 * 整合的知識點：ref / computed / v-model / v-for / v-if / @click / :class
 */

// TODO: 完成以下所有邏輯

// 1. import 需要的 API
import {  } from 'vue'

// 2. 響應式資料
//    - todos: ref([]) — 待辦清單，每個 todo: { id, text, completed, createdAt }
//    - newTodoText: ref('') — 新增輸入框的值
//    - filter: ref('all') — 篩選狀態：'all' | 'active' | 'completed'

// 3. 計算屬性
//    - filteredTodos: 根據 filter 過濾後的 todos
//    - remainingCount: 未完成的數量

// 4. 函式
//    - addTodo(): 新增 todo（輸入不能為空）
//    - toggleTodo(id): 切換 completed 狀態
//    - deleteTodo(id): 刪除 todo
//    - clearCompleted(): 清除所有已完成

// 請在此自行撰寫...
</script>

<template>
  <div class="todo-app">
    <h2 class="todo-title">📝 My Todo List</h2>

    <!-- 新增輸入區 -->
    <div class="todo-input-row">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="有什麼要做的事？按 Enter 新增"
        class="todo-input"
        @keyup.enter="addTodo"
      />
      <button
        class="btn btn-primary"
        :disabled="!newTodoText.trim()"
        @click="addTodo"
      >
        新增
      </button>
    </div>

    <!-- 篩選 Tab -->
    <nav class="filter-tabs">
      <button
        v-for="tab in [
          { key: 'all', label: '全部' },
          { key: 'active', label: '未完成' },
          { key: 'completed', label: '已完成' },
        ]"
        :key="tab.key"
        class="filter-tab"
        :class="{ 'filter-tab-active': filter === tab.key }"
        @click="filter = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- 空狀態 -->
    <div v-if="filteredTodos.length === 0" class="empty-state">
      <p>{{ filter === 'all' ? '還沒有待辦事項，新增一個吧！' : '沒有符合條件的待辦' }}</p>
    </div>

    <!-- Todo 列表 -->
    <ul v-else class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ 'todo-completed': todo.completed }"
      >
        <!-- 點擊文字切換完成狀態 -->
        <span class="todo-text" @click="toggleTodo(todo.id)">
          {{ todo.completed ? '✅' : '⬜' }} {{ todo.text }}
        </span>

        <!-- 刪除按鈕 -->
        <button class="todo-delete" @click="deleteTodo(todo.id)">✕</button>
      </li>
    </ul>

    <!-- 底部統計列 -->
    <footer v-if="todos.length > 0" class="todo-footer">
      <span class="remaining-count">剩餘 {{ remainingCount }} 項</span>
      <button
        v-if="todos.some(t => t.completed)"
        class="btn btn-outline clear-btn"
        @click="clearCompleted"
      >
        清除已完成
      </button>
    </footer>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}

.todo-title {
  text-align: center;
  margin-bottom: var(--space-lg);
  color: var(--color-secondary);
}

/* 新增輸入列 */
.todo-input-row {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.todo-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: border-color var(--transition-fast);
}

.todo-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 篩選 Tab */
.filter-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: var(--space-md);
  background: var(--color-bg);
  padding: 4px;
  border-radius: var(--radius-md);
}

.filter-tab {
  flex: 1;
  padding: 6px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-muted);
}

.filter-tab-active {
  background: white;
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-muted);
}

/* Todo 列表 */
.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--space-md);
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 12px var(--space-md);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

/* 已完成的樣式 */
.todo-completed .todo-text {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.todo-text {
  flex: 1;
  cursor: pointer;
  user-select: none;
}

.todo-delete {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.todo-delete:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* 底部統計 */
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.remaining-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.clear-btn {
  font-size: var(--font-size-sm);
  padding: 4px 12px;
}
</style>

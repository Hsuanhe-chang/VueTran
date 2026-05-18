<script setup lang="ts">
// Stage 題目列表頁：顯示該 Stage 的所有考題，點擊進入作答頁
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { stages } from '@/exercises/stages'
import type { ExerciseType } from '@/exercises/types'
import DifficultyBadge from '@/components/quiz/DifficultyBadge.vue'

const route = useRoute()

// 根據路由參數取得當前 Stage 資料（stageId 可能是 string | string[]，需轉換）
const stage = computed(() => stages[route.params.stageId as string] ?? null)

// 題型對應的 CSS class（Record 限制 key 必須是合法的 ExerciseType）
const typeColorMap: Record<ExerciseType, string> = {
  填空: 'type-fill',
  從零撰寫: 'type-write',
  找錯誤: 'type-debug',
  重構: 'type-refactor',
  功能實作: 'type-feature',
}
</script>

<template>
  <!-- Stage 不存在時的錯誤提示 -->
  <div v-if="!stage" class="error-msg">
    找不到 Stage {{ route.params.stageId }}，請回到
    <RouterLink to="/">首頁</RouterLink>。
  </div>

  <div v-else class="exercise-list-view">
    <!-- 頁面 Header -->
    <header class="list-header">
      <RouterLink to="/" class="back-link">← 回首頁</RouterLink>
      <div class="stage-info">
        <span class="stage-icon">{{ stage.icon }}</span>
        <div>
          <h1 class="stage-title">Stage {{ stage.id }}：{{ stage.title }}</h1>
          <p class="stage-subtitle">{{ stage.subtitle }}</p>
        </div>
      </div>
      <!-- 官方文件連結 -->
      <a class="doc-link btn btn-outline" :href="stage.docUrl" target="_blank" rel="noopener noreferrer">
        📖 查看官方文件
      </a>
    </header>

    <!-- 題目列表 -->
    <ul class="exercise-list" aria-label="考題列表">
      <li v-for="exercise in stage.exercises" :key="exercise.id" class="exercise-item card">
        <RouterLink
          :to="{ name: 'exercise', params: { stageId: route.params.stageId, questionId: exercise.id } }"
          class="exercise-link"
        >
          <!-- 左側：題號 + 標題 + 題型 -->
          <div class="exercise-info">
            <span class="exercise-id">{{ exercise.id.toUpperCase() }}</span>
            <div class="exercise-text">
              <h3 class="exercise-title">{{ exercise.title }}</h3>
              <!-- 題型標籤 -->
              <div class="exercise-types">
                <span
                  v-for="type in exercise.types"
                  :key="type"
                  class="type-badge"
                  :class="typeColorMap[type] || 'type-fill'"
                >
                  {{ type }}
                </span>
              </div>
            </div>
          </div>

          <!-- 右側：難度 + 箭頭 -->
          <div class="exercise-right">
            <DifficultyBadge :level="exercise.difficulty" />
            <span class="arrow">→</span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 頁面整體 */
.exercise-list-view {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-lg) 0;
}

/* 錯誤提示 */
.error-msg {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-muted);
}

/* Header 區塊 */
.list-header {
  margin-bottom: var(--space-xl);
}

.back-link {
  display: inline-block;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.stage-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.stage-icon {
  font-size: 2.5rem;
}

.stage-title {
  font-size: var(--font-size-2xl);
  color: var(--color-secondary);
  margin-bottom: var(--space-xs);
}

.stage-subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.doc-link {
  display: inline-flex;
}

/* 題目列表 */
.exercise-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* 題目卡片 */
.exercise-item {
  padding: 0;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.exercise-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

/* 整個卡片都是可點擊連結 */
.exercise-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  color: inherit;
  text-decoration: none;
}

.exercise-link:hover {
  text-decoration: none;
  color: inherit;
}

/* 左側資訊 */
.exercise-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

/* 題號標籤 */
.exercise-id {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--font-size-sm);
  background: var(--color-secondary);
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  min-width: 48px;
  text-align: center;
}

.exercise-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  margin-bottom: 4px;
}

/* 題型標籤群 */
.exercise-types {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 題型 badge（共用樣式，與 QuizLayout 一致） */
.type-badge {
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.type-fill     { background: rgba(99, 102, 241, 0.12); color: #4f46e5; }
.type-write    { background: rgba(14, 165, 233, 0.12); color: #0284c7; }
.type-debug    { background: rgba(249, 115, 22, 0.12); color: #ea580c; }
.type-refactor { background: rgba(139, 92, 246, 0.12); color: #7c3aed; }
.type-feature  { background: rgba(16, 185, 129, 0.12); color: #059669; }

/* 右側：難度 + 箭頭 */
.exercise-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-shrink: 0;
}

.arrow {
  color: var(--color-text-muted);
  font-size: 1.2rem;
}
</style>

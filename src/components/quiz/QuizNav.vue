<script setup lang="ts">
// 考題導航元件：提供上一題 / 下一題 / 回列表三個按鈕
import { useRouter } from 'vue-router'
import type { ExerciseMeta } from '@/exercises/types'

// 使用 TypeScript 泛型語法定義 props，ExerciseMeta 提供精確型別
const props = defineProps<{
  // 當前 stage ID（字串，對應路由參數）
  stageId: string
  // 前一道題目的 metadata，null 表示已是第一題
  prev: ExerciseMeta | null
  // 下一道題目的 metadata，null 表示已是最後一題
  next: ExerciseMeta | null
}>()

const router = useRouter()

// 導航到指定題目（TypeScript 知道 exercise 的 id 型別為 string）
function goTo(exercise: ExerciseMeta): void {
  router.push({
    name: 'exercise',
    params: { stageId: props.stageId, questionId: exercise.id },
  })
}

// 回到該 Stage 的題目列表頁
function goToList(): void {
  router.push({ name: 'exercise-list', params: { stageId: props.stageId } })
}
</script>

<template>
  <nav class="quiz-nav" aria-label="考題導航">
    <!-- 上一題按鈕：第一題時禁用 -->
    <button class="btn btn-outline nav-btn" :disabled="!props.prev" @click="props.prev && goTo(props.prev)">
      ← 上一題
    </button>

    <!-- 回列表按鈕（中間） -->
    <button class="btn btn-outline nav-btn list-btn" @click="goToList">📋 題目列表</button>

    <!-- 下一題按鈕：最後一題時禁用 -->
    <button class="btn btn-outline nav-btn" :disabled="!props.next" @click="props.next && goTo(props.next)">
      下一題 →
    </button>
  </nav>
</template>

<style scoped>
/* 水平排列三個按鈕 */
.quiz-nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-lg);
}

/* 禁用狀態：降低透明度，取消點擊 */
.nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* 回列表按鈕置中 */
.list-btn {
  margin: 0 auto;
}
</style>

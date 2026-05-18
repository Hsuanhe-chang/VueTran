<script setup lang="ts">
/**
 * 考題作答頁（TypeScript 版）：動態載入對應 Stage + Question 的 Starter.vue 與 Answer.vue
 * 透過路由參數（stageId, questionId）查詢 stages.ts 中的 metadata，
 * 再用 defineAsyncComponent 懶載入元件，避免一次載入所有考題造成效能問題。
 */
import { computed, shallowRef, watch, defineAsyncComponent, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { getExercise, getAdjacentExercises } from '@/exercises/stages'
import QuizLayout from '@/components/quiz/QuizLayout.vue'
import ExerciseComingSoon from '@/components/quiz/ExerciseComingSoon.vue'

const route = useRoute()

// ─── 根據路由參數取得當前題目的 metadata ─────────────────
// route.params 的值可能是 string | string[]，用 as string 確保型別
const stageId = computed(() => route.params.stageId as string)
const questionId = computed(() => route.params.questionId as string)

const exercise = computed(() => getExercise(stageId.value, questionId.value))

// 前後題目（用於 QuizNav 導航按鈕）
const adjacent = computed(() => getAdjacentExercises(stageId.value, questionId.value))

// ─── 動態載入 Starter 與 Answer 元件 ────────────────────
// 使用 shallowRef 存放元件定義，型別為 Component | null
// shallowRef 避免 Vue 深層追蹤元件物件（提升效能）
const StarterComponent = shallowRef<Component | null>(null)
const AnswerComponent = shallowRef<Component | null>(null)

/**
 * 當路由中的 exercise 改變時，重新載入對應元件。
 * { immediate: true } 確保頁面初次載入時也會執行一次。
 */
watch(
  exercise,
  (ex) => {
    if (!ex) {
      // 題目不存在時清空元件（顯示 not-found 提示）
      StarterComponent.value = null
      AnswerComponent.value = null
      return
    }
    // defineAsyncComponent 接受 loader 函式，errorComponent 在載入失敗時顯示（如檔案不存在）
    StarterComponent.value = defineAsyncComponent({
      loader: ex.component,
      errorComponent: ExerciseComingSoon,
      delay: 200,
    })
    AnswerComponent.value = defineAsyncComponent({
      loader: ex.answer,
      errorComponent: ExerciseComingSoon,
      delay: 200,
    })
  },
  { immediate: true },
)
</script>

<template>
  <!-- 題目不存在時（錯誤的 stageId 或 questionId） -->
  <div v-if="!exercise" class="not-found card">
    <h2>找不到此題目</h2>
    <p>Stage {{ stageId }} / {{ questionId }} 不存在，請回到題目列表。</p>
    <RouterLink
      :to="{ name: 'exercise-list', params: { stageId } }"
      class="btn btn-primary"
      style="margin-top: 16px; display: inline-flex"
    >
      回到題目列表
    </RouterLink>
  </div>

  <!-- 正常顯示考題 -->
  <QuizLayout
    v-else
    :question-id="exercise.id.toUpperCase()"
    :title="exercise.title"
    :difficulty="exercise.difficulty"
    :types="exercise.types"
    :doc-url="exercise.docUrl"
    :doc-section="exercise.docSection"
    :stage-id="stageId"
    :prev="adjacent.prev"
    :next="adjacent.next"
  >
    <!-- Starter slot：學生作答的元件 -->
    <template #starter>
      <!-- Suspense 處理元件非同步載入期間的 loading 狀態 -->
      <Suspense>
        <component :is="StarterComponent" />
        <template #fallback>
          <div class="loading-placeholder">⏳ 載入題目中...</div>
        </template>
      </Suspense>
    </template>

    <!-- Answer slot：參考答案元件 -->
    <template #answer>
      <Suspense>
        <component :is="AnswerComponent" />
        <template #fallback>
          <div class="loading-placeholder">⏳ 載入答案中...</div>
        </template>
      </Suspense>
    </template>
  </QuizLayout>
</template>

<style scoped>
/* 找不到題目的提示區塊 */
.not-found {
  max-width: 500px;
  margin: var(--space-xl) auto;
  text-align: center;
}

.not-found h2 {
  margin-bottom: var(--space-md);
  color: #ef4444;
}

/* 非同步載入等待提示 */
.loading-placeholder {
  padding: var(--space-lg);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}
</style>

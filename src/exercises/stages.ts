// 考題中央索引（TypeScript 版）：匯集所有 Stage 的 metadata，供路由與 UI 使用
// 新增 Stage 時，在此 import 並加入 stages 物件即可
import { stage01Exercises } from './stage-01-foundations/index'
import { stage02Exercises } from './stage-02-components/index'
import { stage03Exercises } from './stage-03-composables/index'
import { stage04Exercises } from './stage-04-router/index'
import { stage05Exercises } from './stage-05-pinia/index'
import { stage06Exercises } from './stage-06-advanced/index'
import { stage07Exercises } from './stage-07-realworld/index'

// 引入型別定義
import type { StageMeta, StagesRecord, ExerciseMeta } from './types'

// stages 物件：key 為路由中的 stageId（字串），value 為 StageMeta
export const stages: StagesRecord = {
  '1': {
    id: 1,
    title: 'Vue 3 Composition API 基礎',
    subtitle: 'ref · reactive · computed · watch · lifecycle · v-model',
    icon: '⚡',
    docUrl: 'https://vuejs.org/guide/essentials/reactivity-fundamentals',
    exercises: stage01Exercises,
  },
  '2': {
    id: 2,
    title: '元件設計與元件間通訊',
    subtitle: 'props · emits · slots · provide/inject · defineModel',
    icon: '🧩',
    docUrl: 'https://vuejs.org/guide/components/registration',
    exercises: stage02Exercises,
  },
  '3': {
    id: 3,
    title: 'Composables 與邏輯複用',
    subtitle: 'composables · custom directives · plugins',
    icon: '🔧',
    docUrl: 'https://vuejs.org/guide/reusability/composables',
    exercises: stage03Exercises,
  },
  '4': {
    id: 4,
    title: 'Vue Router 路由管理',
    subtitle: 'createRouter · 動態路由 · 導航守衛 · 懶載入',
    icon: '🗺️',
    docUrl: 'https://vuejs.org/guide/scaling-up/routing',
    exercises: stage04Exercises,
  },
  '5': {
    id: 5,
    title: 'Pinia 狀態管理',
    subtitle: 'defineStore · state · getters · actions · storeToRefs',
    icon: '🍍',
    docUrl: 'https://vuejs.org/guide/scaling-up/state-management',
    exercises: stage05Exercises,
  },
  '6': {
    id: 6,
    title: '進階元件技術與效能',
    subtitle: 'KeepAlive · Transition · Teleport · Suspense · shallowRef',
    icon: '🚀',
    docUrl: 'https://vuejs.org/guide/built-ins/keep-alive',
    exercises: stage06Exercises,
  },
  '7': {
    id: 7,
    title: '大型專案實戰',
    subtitle: 'API 整合 · 錯誤處理 · 表單驗證 · TypeScript · Vitest',
    icon: '🏗️',
    docUrl: 'https://vuejs.org/guide/best-practices/production-deployment',
    exercises: stage07Exercises,
  },
}

/**
 * 根據 stageId 與 questionId 取得單道考題的 metadata
 * @param stageId - 路由中的 stage 編號（字串）
 * @param questionId - 題目 ID，如 'q01'
 * @returns 考題 metadata，找不到時回傳 null
 */
export function getExercise(stageId: string, questionId: string): ExerciseMeta | null {
  return stages[stageId]?.exercises.find((e) => e.id === questionId) ?? null
}

/**
 * 取得某 stage 內某道題目的前後題目（用於導航按鈕）
 * @param stageId - Stage 編號字串
 * @param questionId - 當前題目 ID
 * @returns 前後題目的 metadata，無前/後題時為 null
 */
export function getAdjacentExercises(
  stageId: string,
  questionId: string,
): { prev: ExerciseMeta | null; next: ExerciseMeta | null } {
  // 取得該 Stage 的所有題目，若 Stage 不存在則使用空陣列
  const exercises: ExerciseMeta[] = stages[stageId]?.exercises ?? []

  // 找到當前題目在陣列中的索引
  const index = exercises.findIndex((e) => e.id === questionId)

  return {
    // 若已是第一題（index <= 0），則 prev 為 null
    prev: index > 0 ? exercises[index - 1] : null,
    // 若已是最後一題（index >= length - 1），則 next 為 null
    next: index < exercises.length - 1 ? exercises[index + 1] : null,
  }
}

// 重新匯出型別，方便其他模組直接從 stages 取用
export type { StageMeta, ExerciseMeta }

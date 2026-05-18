// 考題中央索引：匯集所有 Stage 的 metadata，供路由與 UI 使用
// 新增 Stage 時，在此 import 並加入 stages 物件即可
import { stage01Exercises } from './stage-01-foundations/index.js'
import { stage02Exercises } from './stage-02-components/index.js'
import { stage03Exercises } from './stage-03-composables/index.js'
import { stage04Exercises } from './stage-04-router/index.js'
import { stage05Exercises } from './stage-05-pinia/index.js'
import { stage06Exercises } from './stage-06-advanced/index.js'
import { stage07Exercises } from './stage-07-realworld/index.js'

// stages 物件：key 為路由中的 stageId（字串）
export const stages = {
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
 * @param {string} stageId - 路由中的 stage 編號（字串）
 * @param {string} questionId - 題目 ID，如 'q01'
 * @returns {object|null} 考題 metadata，找不到時回傳 null
 */
export function getExercise(stageId, questionId) {
  return stages[stageId]?.exercises.find((e) => e.id === questionId) ?? null
}

/**
 * 取得某 stage 內某道題目的前後題目（用於導航按鈕）
 * @param {string} stageId
 * @param {string} questionId
 * @returns {{ prev: object|null, next: object|null }}
 */
export function getAdjacentExercises(stageId, questionId) {
  const exercises = stages[stageId]?.exercises ?? []
  const index = exercises.findIndex((e) => e.id === questionId)

  return {
    prev: index > 0 ? exercises[index - 1] : null,
    next: index < exercises.length - 1 ? exercises[index + 1] : null,
  }
}

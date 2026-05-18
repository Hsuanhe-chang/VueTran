/**
 * 練習題型別定義
 * 集中管理所有考題相關的 TypeScript 介面與型別
 */

// ─── 題型文字 ──────────────────────────────────────────
// 所有允許的題型標籤（與 typeColorMap 對應）
export type ExerciseType = '填空' | '從零撰寫' | '找錯誤' | '重構' | '功能實作'

// 難度：1=基礎, 2=中級, 3=進階
export type Difficulty = 1 | 2 | 3

// ─── 單道考題的 metadata 介面 ──────────────────────────
export interface ExerciseMeta {
  /** 題目識別碼，如 'q01'，對應路由 questionId */
  id: string
  /** 題目顯示標題 */
  title: string
  /** 難度等級 */
  difficulty: Difficulty
  /** 題型陣列 */
  types: ExerciseType[]
  /** 對應官方文件的完整 URL */
  docUrl: string
  /** 官方文件章節名稱（顯示於 QuizLayout） */
  docSection: string
  /** 動態 import 函式 → Starter.vue（學生作答） */
  component: () => Promise<unknown>
  /** 動態 import 函式 → Answer.vue（參考答案） */
  answer: () => Promise<unknown>
}

// ─── 單個 Stage 的 metadata 介面 ───────────────────────
export interface StageMeta {
  /** Stage 編號（數字） */
  id: number
  /** Stage 顯示標題 */
  title: string
  /** Stage 副標題（列出關鍵概念） */
  subtitle: string
  /** Stage 圖示（emoji） */
  icon: string
  /** 對應官方文件 URL */
  docUrl: string
  /** 此 Stage 包含的所有考題 */
  exercises: ExerciseMeta[]
}

// ─── stages 物件的型別（以路由 stageId 字串為 key）──────
export type StagesRecord = Record<string, StageMeta>

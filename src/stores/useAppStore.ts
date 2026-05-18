// 全域 App Store（TypeScript 版）：管理主題切換與考題作答狀態
// 使用 Pinia 3 的 Setup Store 寫法（Composition API 風格）
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 主題型別：明確限制只允許 'light' 或 'dark'
type Theme = 'light' | 'dark'

export const useAppStore = defineStore('app', () => {
  // ─── State ───────────────────────────────────────────
  // 目前顯示模式（light / dark），型別推論為 Theme
  const theme = ref<Theme>('light')

  // 是否顯示參考答案（在 ExerciseView 中使用）
  const showAnswer = ref<boolean>(false)

  // ─── Getters（衍生狀態）─────────────────────────────
  // 判斷是否為深色模式（避免在 template 中比較字串）
  const isDark = computed<boolean>(() => theme.value === 'dark')

  // ─── Actions（修改 state 的函式）────────────────────
  // 切換亮色 / 深色主題
  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 顯示或隱藏參考答案
  function toggleAnswer(): void {
    showAnswer.value = !showAnswer.value
  }

  // 換題時重置「顯示答案」狀態，避免下一題直接顯示答案
  function resetAnswerState(): void {
    showAnswer.value = false
  }

  // Setup Store 必須 return 所有要暴露的屬性與方法
  return {
    theme,
    isDark,
    showAnswer,
    toggleTheme,
    toggleAnswer,
    resetAnswerState,
  }
})

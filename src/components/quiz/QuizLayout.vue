<script setup>
// 考題外框元件：顯示題目 metadata 並提供「顯示答案」切換
import { ref } from 'vue'
import DifficultyBadge from './DifficultyBadge.vue'
import QuizNav from './QuizNav.vue'

const props = defineProps({
  // 題目編號，如 'Q01'
  questionId: { type: String, required: true },
  // 題目標題
  title: { type: String, required: true },
  // 難度：1/2/3
  difficulty: { type: Number, required: true },
  // 題型陣列，如 ['填空', '從零撰寫']
  types: { type: Array, required: true },
  // 對應的官方文件 URL
  docUrl: { type: String, required: true },
  // 對應的官方文件章節名稱
  docSection: { type: String, required: true },
  // 當前 stage ID
  stageId: { type: String, required: true },
  // 前一題 metadata（QuizNav 使用）
  prev: { type: Object, default: null },
  // 後一題 metadata（QuizNav 使用）
  next: { type: Object, default: null },
})

// 控制是否顯示參考答案
const showAnswer = ref(false)

// 題型標籤的 CSS class 對應表
const typeColorMap = {
  填空: 'type-fill',
  從零撰寫: 'type-write',
  找錯誤: 'type-debug',
  重構: 'type-refactor',
  功能實作: 'type-feature',
}
</script>

<template>
  <article class="quiz-layout card">
    <!-- ─── 題目 Header ─── -->
    <header class="quiz-header">
      <div class="quiz-meta">
        <!-- 題目編號 -->
        <span class="question-id">{{ props.questionId }}</span>

        <!-- 難度標籤 -->
        <DifficultyBadge :level="props.difficulty" />

        <!-- 題型標籤（可能有多個） -->
        <span
          v-for="type in props.types"
          :key="type"
          class="type-badge"
          :class="typeColorMap[type] || 'type-fill'"
        >
          {{ type }}
        </span>
      </div>

      <!-- 題目標題 -->
      <h2 class="quiz-title">{{ props.title }}</h2>

      <!-- 對應官方文件連結 -->
      <a class="doc-link" :href="props.docUrl" target="_blank" rel="noopener noreferrer">
        📖 官方文件：{{ props.docSection }}
      </a>
    </header>

    <!-- ─── 題目內容（Starter.vue 由父層傳入此 slot） ─── -->
    <section class="quiz-content">
      <slot name="starter" />
    </section>

    <!-- ─── 答案切換區 ─── -->
    <section class="quiz-answer-section">
      <button
        class="btn"
        :class="showAnswer ? 'btn-outline' : 'btn-primary'"
        @click="showAnswer = !showAnswer"
      >
        {{ showAnswer ? '🙈 隱藏答案' : '👀 顯示參考答案' }}
      </button>

      <!-- 答案區：showAnswer 為 true 時才渲染，避免學生誤看 -->
      <div v-if="showAnswer" class="answer-wrapper">
        <h3 class="answer-title">參考答案</h3>
        <slot name="answer" />
      </div>
    </section>

    <!-- ─── 上/下題導航 ─── -->
    <QuizNav :stage-id="props.stageId" :prev="props.prev" :next="props.next" />
  </article>
</template>

<style scoped>
/* 考題卡片整體 */
.quiz-layout {
  max-width: 900px;
  margin: 0 auto;
}

/* 題目 Header 垂直排列 */
.quiz-header {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

/* Meta 列：編號 + 難度 + 題型 */
.quiz-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

/* 題目編號圓框 */
.question-id {
  background: var(--color-secondary);
  color: white;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 700;
  font-family: var(--font-mono);
}

/* 題型標籤基底 */
.type-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.type-fill     { background: rgba(99, 102, 241, 0.12); color: #4f46e5; }
.type-write    { background: rgba(14, 165, 233, 0.12); color: #0284c7; }
.type-debug    { background: rgba(249, 115, 22, 0.12); color: #ea580c; }
.type-refactor { background: rgba(139, 92, 246, 0.12); color: #7c3aed; }
.type-feature  { background: rgba(16, 185, 129, 0.12); color: #059669; }

/* 題目標題 */
.quiz-title {
  margin-bottom: var(--space-sm);
  color: var(--color-secondary);
}

/* 文件連結 */
.doc-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* 題目內容區 */
.quiz-content {
  margin-bottom: var(--space-lg);
}

/* 答案區上方邊框區隔 */
.quiz-answer-section {
  padding-top: var(--space-lg);
  border-top: 2px dashed var(--color-border);
}

/* 答案標題 */
.answer-title {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin: var(--space-md) 0 var(--space-sm);
}

/* 答案包裝區塊 */
.answer-wrapper {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: rgba(66, 184, 131, 0.05);
  border: 1px solid rgba(66, 184, 131, 0.2);
  border-radius: var(--radius-md);
}
</style>

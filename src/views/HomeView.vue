<script setup>
// 課程首頁：顯示所有 Stage 的總覽卡片，點擊進入該 Stage 的題目列表
import { RouterLink } from 'vue-router'
import { stages } from '@/exercises/stages.js'

// 將 stages 物件轉為陣列，方便 v-for 渲染
const stageList = Object.values(stages)
</script>

<template>
  <div class="home-view">
    <!-- 頁面標題區 -->
    <header class="home-hero">
      <h1 class="home-title">Vue 3 學習考題系統</h1>
      <p class="home-subtitle">
        從 Composition API 基礎到大型專案實戰<br />
        共 <strong>7 個學習階段</strong>，循序漸進，每題對應官方文件章節
      </p>
    </header>

    <!-- Stage 卡片格線 -->
    <section class="stage-grid" aria-label="學習階段列表">
      <RouterLink
        v-for="stage in stageList"
        :key="stage.id"
        :to="{ name: 'exercise-list', params: { stageId: String(stage.id) } }"
        class="stage-card card"
      >
        <!-- Stage 圖示與編號 -->
        <div class="stage-icon-row">
          <span class="stage-icon">{{ stage.icon }}</span>
          <span class="stage-number">Stage {{ stage.id }}</span>
          <!-- 題目數量 badge -->
          <span class="exercise-count">{{ stage.exercises.length }} 題</span>
        </div>

        <!-- Stage 標題與副標題 -->
        <h2 class="stage-title">{{ stage.title }}</h2>
        <p class="stage-subtitle">{{ stage.subtitle }}</p>
      </RouterLink>
    </section>

    <!-- 使用說明 -->
    <aside class="usage-guide card">
      <h3>📌 如何使用本系統</h3>
      <ol class="usage-list">
        <li>選擇上方的學習階段（建議從 Stage 1 開始）</li>
        <li>點擊題目，在 <code>Starter.vue</code> 中按照題目說明撰寫程式碼</li>
        <li>完成後點擊「顯示參考答案」核對思路</li>
        <li>每個階段的最後一題（Q99）為綜合實作題，整合該階段所有概念</li>
      </ol>
    </aside>
  </div>
</template>

<style scoped>
/* 頁面整體 */
.home-view {
  padding: var(--space-lg) 0;
}

/* 英雄區塊 */
.home-hero {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.home-title {
  font-size: var(--font-size-3xl);
  color: var(--color-secondary);
  margin-bottom: var(--space-md);
}

.home-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: 1.8;
}

/* Stage 卡片格線：3 欄 */
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

/* Stage 卡片 */
.stage-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  border-left: 4px solid var(--color-primary);
}

.stage-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  text-decoration: none;
  color: inherit;
}

/* 圖示列 */
.stage-icon-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.stage-icon {
  font-size: 1.5rem;
}

.stage-number {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

/* 題目數量 badge */
.exercise-count {
  margin-left: auto;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Stage 標題 */
.stage-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-xs);
  color: var(--color-secondary);
}

/* Stage 副標題 */
.stage-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* 使用說明區塊 */
.usage-guide {
  max-width: 700px;
  margin: 0 auto;
}

.usage-guide h3 {
  margin-bottom: var(--space-md);
}

.usage-list {
  padding-left: var(--space-lg);
  line-height: 2;
  color: var(--color-text-muted);
}
</style>

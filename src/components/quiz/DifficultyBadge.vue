<script setup lang="ts">
// 難度星星標籤元件：接收 1/2/3 顯示對應星星與顏色

// 使用 TypeScript 泛型語法定義 props，Difficulty 限制只能傳入 1, 2, 3
const props = defineProps<{
  // 難度等級：1=基礎, 2=中級, 3=進階
  level: 1 | 2 | 3
}>()

// 將數字對應到顯示文字（Record 明確限制 key 的型別）
const labels: Record<1 | 2 | 3, string> = { 1: '基礎', 2: '中級', 3: '進階' }

// 將數字對應到 CSS class（用於控制顏色）
const levelClass: Record<1 | 2 | 3, string> = { 1: 'level-1', 2: 'level-2', 3: 'level-3' }
</script>

<template>
  <span class="difficulty-badge" :class="levelClass[props.level]">
    <!-- 根據難度顯示 1~3 顆星 -->
    <span v-for="i in props.level" :key="i">⭐</span>
    {{ labels[props.level] }}
  </span>
</template>

<style scoped>
/* 基底標籤樣式 */
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* 各難度顏色 */
.level-1 {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.level-2 {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.level-3 {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}
</style>

<script setup lang="ts">
/** 尚未開放的考題佔位元件：在動態 import 失敗時顯示 */
defineProps<{
  // 哪一個 stage 的題目尚未完成（可選）
  stageId?: string
}>()
</script>

<template>
  <div class="coming-soon">
    <span class="icon">🚧</span>
    <h3>考題即將上線</h3>
    <p>此題目的檔案尚未建立，將在後續更新中加入。</p>
    <p class="hint">你可以繼續練習其他 Stage 1 的題目，或在下一次對話中請 Claude 生成此題。</p>
  </div>
</template>

<style scoped>
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  text-align: center;
  color: var(--color-text-muted);
}

.icon { font-size: 3rem; }
h3 { color: var(--color-secondary); }
.hint { font-size: var(--font-size-sm); max-width: 400px; }
</style>

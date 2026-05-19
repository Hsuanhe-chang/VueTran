<script setup lang="ts">
/** Q06 — 參考答案：Class 與 Style 動態綁定 */
import { ref } from 'vue'

const isActive = ref(false)
const isHighlighted = ref(false)
const fontSize = ref(16)
const customColor = ref('#35495e')
</script>

<template>
  <div class="class-style-demo answer">
    <h3>🎨 Class & Style 練習（參考答案）</h3>

    <!--
      :class 物件語法：{ 'class-name': boolean }
      當 boolean 為 true，該 class 才套用
    -->
    <div
      class="demo-card"
      :class="{
        'card-active': isActive,
        'card-highlighted': isHighlighted,
      }"
      :style="{
        fontSize: fontSize + 'px',
        color: customColor,
      }"
    >
      <p>這張卡片的樣式由響應式資料控制</p>
      <p>isActive: {{ isActive }} | isHighlighted: {{ isHighlighted }}</p>
      <p>fontSize: {{ fontSize }}px | color: {{ customColor }}</p>
    </div>

    <div class="controls">
      <button class="btn btn-outline" @click="isActive = !isActive">切換 Active</button>
      <button class="btn btn-outline" @click="isHighlighted = !isHighlighted">切換 Highlighted</button>
      <label>
        字型大小：{{ fontSize }}px
        <!-- v-model 配合 type="range" 自動綁定數字 -->
        <input type="range" min="12" max="32" v-model.number="fontSize" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.class-style-demo { padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); display: flex; flex-direction: column; gap: var(--space-lg); }
.demo-card { padding: var(--space-lg); background: var(--color-bg-card); border: 2px solid var(--color-border); border-radius: var(--radius-md); transition: all var(--transition-base); }
.card-active { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(66,184,131,0.2); }
.card-highlighted { background: #fffbeb !important; }
.controls { display: flex; flex-direction: column; gap: var(--space-md); }
label { display: flex; align-items: center; gap: var(--space-md); }
</style>

<script setup>
/** Q05 — 參考答案：Template 語法 */
import { ref } from 'vue'

const userName = ref('Vue 學習者')
const count = ref(42)
const imageUrl = ref('https://vuejs.org/images/logo.png')
const imageAlt = ref('Vue Logo')
const richText = ref('<strong style="color: #42b883">Vue</strong> 讓我愛上前端！')
const onceCount = ref(0)
function incrementOnce() { onceCount.value++ }
</script>

<template>
  <div class="template-demo answer">
    <h3>📝 Template 語法練習（參考答案）</h3>

    <!-- 1. 文字插值 -->
    <p>使用者名稱：{{ userName }}</p>

    <!-- 2. 表達式 -->
    <p>計數 × 2 = {{ count * 2 }}</p>

    <!-- 3. 三元運算 -->
    <p>{{ count > 40 ? '大' : '小' }}</p>

    <!-- 4. v-bind 縮寫（: 是 v-bind: 的縮寫） -->
    <img :src="imageUrl" :alt="imageAlt" width="60" />

    <!-- 5. v-html：渲染 HTML 字串（⚠️ 只用於信任的內容） -->
    <p v-html="richText"></p>

    <!-- 6. v-once：第一次渲染後不再更新 -->
    <p v-once>v-once 計數（初始值）：{{ onceCount }}</p>
    <p>一般計數（會更新）：{{ onceCount }}</p>
    <button class="btn btn-outline" @click="incrementOnce">點我 +1</button>
    <p class="hint">按下按鈕後，v-once 的那行不會更新，下面那行會更新</p>
  </div>
</template>

<style scoped>
.template-demo { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
h3 { margin-bottom: var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
</style>

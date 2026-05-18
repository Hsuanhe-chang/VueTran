<script setup>
/** Q05 — Template 語法：插值與指令（填空題）
 *  現況：所有變數已準備好，你需要在 template 中填入正確的語法
 */
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
  <div class="template-demo">
    <h3>📝 Template 語法練習</h3>

    <!-- TODO 1: 把 '???' 改為正確的插值語法顯示 userName -->
    <p>使用者名稱：{{ '???' }}</p>

    <!-- TODO 2: 把 '???' 改為在 {{ }} 中計算 count * 2 的表達式 -->
    <p>計數 × 2 = {{ '???' }}</p>

    <!-- TODO 3: 把 '???' 改為三元運算（count > 40 顯示「大」，否則「小」） -->
    <p>{{ '???' }}</p>

    <!-- TODO 4: 在 img 上加 :src="imageUrl" :alt="imageAlt"（v-bind 縮寫） -->
    <img src="" alt="placeholder" width="60" />
    <!-- ↑ 把 src="" alt="placeholder" 改為動態綁定 -->

    <!-- TODO 5: 在 p 上加 v-html="richText" -->
    <p>這裡應該顯示 HTML 格式的文字</p>
    <!-- ↑ 加上 v-html 指令 -->

    <!-- TODO 6: 在第一個 p 加上 v-once，讓它只渲染一次 -->
    <p>v-once 計數（初始值）：{{ onceCount }}</p>
    <p>一般計數（會更新）：{{ onceCount }}</p>
    <button class="btn btn-outline" @click="incrementOnce">點我 +1</button>
    <p class="hint">加上 v-once 後，按按鈕時第一行不應該更新</p>
  </div>
</template>

<style scoped>
.template-demo { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h3 { margin-bottom: var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
</style>

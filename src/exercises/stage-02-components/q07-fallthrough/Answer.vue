<script setup lang="ts">
/** Q07 — Fallthrough Attributes（解答）
 *
 *  核心概念：
 *  - 預設 attrs（class / style / id / event listener）自動套用到元件根元素
 *  - 若根元素不是目標元素（如包了一層 div），需要手動控制
 *  - defineOptions({ inheritAttrs: false }) 關閉自動繼承
 *  - useAttrs() 取得所有 attrs，再用 v-bind="attrs" 手動套用到正確元素
 */
import { useAttrs } from 'vue'

// 禁止 Vue 自動把 attrs 套用到根元素
defineOptions({ inheritAttrs: false })

// 取得父層傳入的所有 attrs（class / style / id / @click 等）
const attrs = useAttrs()
</script>

<template>
  <!--
    根元素是 div，但我們不想讓 attrs 套在這裡
    所以用 inheritAttrs: false 關閉自動繼承
  -->
  <div class="btn-wrapper">
    <!--
      v-bind="attrs" 把所有 attrs 手動展開套用到真正的 <button>
      這樣父層的 class / style / @click 才會正確作用在 button 上
    -->
    <button class="btn btn-primary" v-bind="attrs">
      <slot>按鈕</slot>
    </button>
    <span class="btn-shadow"></span>
  </div>

  <!-- ── 解答說明（展示用） ── -->
  <!-- 注意：以下是展示用說明，在真實元件中不會有這段 -->
</template>

<style scoped>
.btn-wrapper { display: inline-flex; flex-direction: column; align-items: stretch; gap: 0; }
.btn-shadow { height: 3px; background: rgba(0,0,0,0.15); border-radius: 0 0 var(--radius-sm) var(--radius-sm); }
</style>

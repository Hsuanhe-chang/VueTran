<script setup>
/** Q07 — Fallthrough Attributes（找錯誤）
 *  你正在實作 CustomButton 元件，它封裝了一個 <button>。
 *  問題：父層加的 class / style / id 等 attrs 會落到最外層的 <div>，
 *        而不是真正的 <button> 上。
 *
 *  找出問題並修正，讓 attrs 正確傳遞給內部的 <button>。
 *
 *  父層使用方式：
 *    <CustomButton class="my-btn" style="margin: 8px" @click="doSomething">
 *      點擊我
 *    </CustomButton>
 *
 *  期望結果：class="my-btn" 和 style 出現在 <button> 上，而非 <div> 上。
 */

// Bug：缺少 inheritAttrs: false，導致 attrs 自動套用到根元素（<div>）
// Bug：缺少 useAttrs() 取得 attrs 並手動傳給 <button>
//
// TODO：加入以下兩行：
// import { useAttrs } from 'vue'
// defineOptions({ inheritAttrs: false })
// const attrs = useAttrs()
</script>

<template>
  <!--
    Bug：<div> 是根元素，所以 attrs（class / style / id）都掉到這個 div 上
    修正：加 inheritAttrs: false，然後在 <button> 上用 v-bind="attrs"
  -->
  <div class="btn-wrapper">
    <button class="btn btn-primary">
      <slot>按鈕</slot>
    </button>
    <span class="btn-shadow"></span>
  </div>
</template>

<style scoped>
.btn-wrapper { display: inline-flex; flex-direction: column; align-items: stretch; gap: 0; }
.btn-shadow { height: 3px; background: rgba(0,0,0,0.15); border-radius: 0 0 var(--radius-sm) var(--radius-sm); }
</style>

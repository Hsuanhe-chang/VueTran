<script setup>
/** Q02 — Transition 進入/離開動畫（從零撰寫 CSS）
 *
 *  <Transition name="fade"> 會為子元素加入 6 個 CSS 類別：
 *    fade-enter-from  → fade-enter-active → fade-enter-to
 *    fade-leave-from  → fade-leave-active → fade-leave-to
 *
 *  常見模式：
 *    enter-active / leave-active：定義 transition 時長與 easing
 *    enter-from / leave-to：定義「起始/結束」的不可見狀態
 *    enter-to / leave-from：通常就是元素的正常狀態（不需要寫）
 */
import { ref } from 'vue'

const showFade      = ref(true)
const showSlide     = ref(true)
const showScale     = ref(true)
</script>

<template>
  <div class="transition-demo">
    <h3>✨ Q02 — Transition 進入/離開動畫（練習）</h3>

    <!-- ── Demo 1：Fade（漸隱漸現）── -->
    <section class="demo-section">
      <div class="demo-header">
        <h4>Demo 1 — Fade（名稱：<code>fade</code>）</h4>
        <button class="btn btn-sm" @click="showFade = !showFade">
          {{ showFade ? '隱藏' : '顯示' }}
        </button>
      </div>
      <div class="demo-area">
        <!-- Transition 元件已設定，需補齊 style 區塊中的 CSS -->
        <Transition name="fade">
          <div v-if="showFade" class="demo-box blue-box">
            <p>Fade 動畫</p>
            <p class="hint">opacity 0 ↔ 1，時長 0.4s</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── Demo 2：Slide Down（從上滑入）── -->
    <section class="demo-section">
      <div class="demo-header">
        <h4>Demo 2 — Slide Down（名稱：<code>slide-down</code>）</h4>
        <button class="btn btn-sm" @click="showSlide = !showSlide">
          {{ showSlide ? '隱藏' : '顯示' }}
        </button>
      </div>
      <div class="demo-area">
        <Transition name="slide-down">
          <div v-if="showSlide" class="demo-box green-box">
            <p>Slide Down 動畫</p>
            <p class="hint">從 translateY(-20px) 滑入，配合 opacity 變化</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── Demo 3：Scale（縮放）── -->
    <section class="demo-section">
      <div class="demo-header">
        <h4>Demo 3 — Scale（名稱：<code>scale</code>）</h4>
        <button class="btn btn-sm" @click="showScale = !showScale">
          {{ showScale ? '隱藏' : '顯示' }}
        </button>
      </div>
      <div class="demo-area">
        <Transition name="scale">
          <div v-if="showScale" class="demo-box purple-box">
            <p>Scale 動畫</p>
            <p class="hint">從 scale(0.8) 縮放到 scale(1)</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── CSS 類別說明 ── -->
    <section class="demo-section">
      <h4>Transition CSS 類別命名規則</h4>
      <pre v-pre class="code-block">/* name="fade" 時，Vue 自動加入這 6 個類別：*/

/* ① 進入階段 */
.fade-enter-from   { /* 元素進入前的初始狀態（opacity: 0）*/ }
.fade-enter-active { /* 進入動畫的 transition 設定（時長/easing）*/ }
.fade-enter-to     { /* 進入後的目標狀態（通常不需要寫）*/ }

/* ② 離開階段 */
.fade-leave-from   { /* 元素離開前的狀態（通常不需要寫）*/ }
.fade-leave-active { /* 離開動畫的 transition 設定 */ }
.fade-leave-to     { /* 元素離開後的結束狀態（opacity: 0）*/ }</pre>
    </section>
  </div>
</template>

<style scoped>
.transition-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.demo-header { display: flex; align-items: center; justify-content: space-between; }
h4 { color: var(--color-secondary); margin: 0; font-size: 0.95rem; }
code { background: var(--color-border); padding: 1px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.demo-area { min-height: 80px; display: flex; align-items: center; }
.demo-box { padding: var(--space-md); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 4px; min-width: 200px; }
.blue-box   { background: rgba(99,102,241,0.12); border: 1.5px solid rgba(99,102,241,0.3); }
.green-box  { background: rgba(74,222,128,0.12); border: 1.5px solid rgba(74,222,128,0.3); }
.purple-box { background: rgba(168,85,247,0.12); border: 1.5px solid rgba(168,85,247,0.3); }
.demo-box p { margin: 0; font-weight: 600; font-size: var(--font-size-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); font-weight: 400 !important; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }

/* ════════════════════════════════════════════════════
   TODO：在此撰寫所有 Transition CSS 類別
   ════════════════════════════════════════════════════ */

/* ── Demo 1：fade ──────────────────────────────────── */
/* TODO：.fade-enter-active, .fade-leave-active */
/* TODO：.fade-enter-from, .fade-leave-to */

/* ── Demo 2：slide-down ─────────────────────────────── */
/* TODO：.slide-down-enter-active, .slide-down-leave-active */
/* TODO：.slide-down-enter-from, .slide-down-leave-to */

/* ── Demo 3：scale ──────────────────────────────────── */
/* TODO：.scale-enter-active, .scale-leave-active */
/* TODO：.scale-enter-from, .scale-leave-to */
</style>

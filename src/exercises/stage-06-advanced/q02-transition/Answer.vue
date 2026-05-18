<script setup>
/** Q02 — Transition 進入/離開動畫（解答）
 *
 *  核心規律：
 *  - enter-active / leave-active：加 `transition` 屬性（控制時長與 easing）
 *  - enter-from / leave-to：定義「看不見」的狀態
 *  - enter-to / leave-from：通常是元素的正常狀態，不用額外寫
 *
 *  性能提示：優先用 `opacity` 和 `transform`，
 *  因為這兩個屬性不觸發 layout reflow，動畫更流暢。
 */
import { ref } from 'vue'

const showFade  = ref(true)
const showSlide = ref(true)
const showScale = ref(true)
</script>

<template>
  <div class="transition-demo">
    <h3>✨ Q02 — Transition 進入/離開動畫（解答）</h3>

    <!-- ── Demo 1：Fade ── -->
    <section class="demo-section">
      <div class="demo-header">
        <h4>Demo 1 — Fade（<code>name="fade"</code>）</h4>
        <button class="btn btn-sm" @click="showFade = !showFade">
          {{ showFade ? '隱藏' : '顯示' }}
        </button>
      </div>
      <div class="demo-area">
        <Transition name="fade">
          <div v-if="showFade" class="demo-box blue-box">
            <p>Fade 動畫 ✅</p>
            <p class="hint">opacity 0 → 1（進入），1 → 0（離開），0.4s ease</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── Demo 2：Slide Down ── -->
    <section class="demo-section">
      <div class="demo-header">
        <h4>Demo 2 — Slide Down（<code>name="slide-down"</code>）</h4>
        <button class="btn btn-sm" @click="showSlide = !showSlide">
          {{ showSlide ? '隱藏' : '顯示' }}
        </button>
      </div>
      <div class="demo-area">
        <Transition name="slide-down">
          <div v-if="showSlide" class="demo-box green-box">
            <p>Slide Down 動畫 ✅</p>
            <p class="hint">translateY(-20px) + opacity 0 → 正常狀態，0.35s</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── Demo 3：Scale ── -->
    <section class="demo-section">
      <div class="demo-header">
        <h4>Demo 3 — Scale（<code>name="scale"</code>）</h4>
        <button class="btn btn-sm" @click="showScale = !showScale">
          {{ showScale ? '隱藏' : '顯示' }}
        </button>
      </div>
      <div class="demo-area">
        <Transition name="scale">
          <div v-if="showScale" class="demo-box purple-box">
            <p>Scale 動畫 ✅</p>
            <p class="hint">scale(0.8) + opacity 0 → scale(1) + opacity 1，0.3s</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── 完整 CSS 說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整 Transition CSS</h4>
      <pre v-pre class="code-block">/* ── Fade ─────────────────────────────── */
.fade-enter-active,
.fade-leave-active  { transition: opacity 0.4s ease; }

.fade-enter-from,
.fade-leave-to      { opacity: 0; }

/* ── Slide Down ──────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }

.slide-down-enter-from,
.slide-down-leave-to     { opacity: 0; transform: translateY(-20px); }

/* ── Scale ───────────────────────────── */
.scale-enter-active,
.scale-leave-active  { transition: opacity 0.3s ease, transform 0.3s ease; }

.scale-enter-from,
.scale-leave-to      { opacity: 0; transform: scale(0.8); }</pre>
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
.demo-box { padding: var(--space-md); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 4px; min-width: 260px; }
.blue-box   { background: rgba(99,102,241,0.12); border: 1.5px solid rgba(99,102,241,0.3); }
.green-box  { background: rgba(74,222,128,0.12); border: 1.5px solid rgba(74,222,128,0.3); }
.purple-box { background: rgba(168,85,247,0.12); border: 1.5px solid rgba(168,85,247,0.3); }
.demo-box p { margin: 0; font-weight: 600; font-size: var(--font-size-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); font-weight: 400 !important; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }

/* ── Fade ──────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active  { transition: opacity 0.4s ease; }
.fade-enter-from,
.fade-leave-to      { opacity: 0; }

/* ── Slide Down ─────────────────────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.slide-down-enter-from,
.slide-down-leave-to     { opacity: 0; transform: translateY(-20px); }

/* ── Scale ──────────────────────────────────────────── */
.scale-enter-active,
.scale-leave-active  { transition: opacity 0.3s ease, transform 0.3s ease; }
.scale-enter-from,
.scale-leave-to      { opacity: 0; transform: scale(0.8); }
</style>

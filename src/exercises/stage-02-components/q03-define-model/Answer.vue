<script setup>
/** Q03 — defineModel（Component v-model）（解答）
 *
 *  核心概念：
 *  - defineModel() 是 Vue 3.4+ 的 macro，簡化 component v-model 實作
 *  - 回傳一個可讀寫的 ref，讀寫時自動與父層的 v-model 同步
 *  - 等同於手動宣告 props.modelValue + emit('update:modelValue', newVal)
 *  - 支援具名模型：defineModel('count')、defineModel('title') 等
 */

// ── defineModel 取得雙向綁定的 ref ───────────────────────────
// type 確保傳入正確型別，default 設定初始值（父層未傳時使用）
const isOn = defineModel({
  type:    Boolean,
  default: false,
})

// 在真實的父層中，父層有自己的 ref 透過 v-model 傳入
// 此處因無父層，isOn 的初始值來自 default: false
</script>

<template>
  <div class="toggle-demo">
    <h3>🔀 Q03 — defineModel 解答</h3>

    <!-- ── 元件主體 ── -->
    <section class="demo-section">
      <h4>CustomToggle 元件（完整實作）</h4>

      <div class="toggle-wrapper">
        <!-- isOn 是 defineModel 回傳的 ref，可直接讀寫 -->
        <button
          :class="['toggle-btn', { active: isOn }]"
          @click="isOn = !isOn"
        >
          <span class="toggle-knob"></span>
        </button>
        <span class="status-label">
          狀態：{{ isOn ? '✅ 啟用' : '❌ 停用' }}
        </span>
      </div>
    </section>

    <!-- ── 父層視角 ── -->
    <section class="demo-section parent-section">
      <h4>父層視角（v-model 綁定的 ref）</h4>
      <div class="parent-value">
        <code>isEnabled.value = {{ isOn }}</code>
      </div>

      <!-- 解答說明 -->
      <div class="answer-block card">
        <h5>✅ defineModel 完整說明</h5>
        <pre class="code-block">// ── 子元件（CustomToggle.vue）──
const isOn = defineModel({ type: Boolean, default: false })

// 在 template 中直接讀寫（等同讀寫父層的 ref）
// :class="{ active: isOn }"
// @click="isOn = !isOn"

// ── 父層使用方式 ──
const isEnabled = ref(false)
// &lt;CustomToggle v-model="isEnabled" /&gt;

// ── 具名 model（多個 v-model）──
// 子：const title = defineModel('title')
// 父：&lt;MyInput v-model:title="pageTitle" /&gt;</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.toggle-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4, h5 { color: var(--color-secondary); margin-bottom: 4px; }
.toggle-wrapper { display: flex; align-items: center; gap: var(--space-md); }
.toggle-btn { width: 56px; height: 30px; border-radius: 15px; border: none; background: var(--color-border); cursor: pointer; position: relative; transition: background 0.3s; padding: 0; }
.toggle-btn.active { background: var(--color-primary); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: white; transition: transform 0.3s; display: block; }
.toggle-btn.active .toggle-knob { transform: translateX(26px); }
.status-label { font-weight: 500; font-size: var(--font-size-lg); }
.parent-section { border-color: var(--color-secondary); }
.parent-value { font-family: var(--font-mono); background: var(--color-bg); padding: var(--space-sm) var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.answer-block { margin-top: var(--space-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 4px 0 0; }
</style>

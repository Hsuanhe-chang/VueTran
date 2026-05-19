<script setup lang="ts">
/** Q03 — defineModel（Component v-model）（從零撰寫）
 *  你正在實作 CustomToggle 元件（美化版 checkbox）。
 *  父層這樣使用它：
 *    <CustomToggle v-model="isEnabled" />
 *
 *  等同於：
 *    <CustomToggle
 *      :modelValue="isEnabled"
 *      @update:modelValue="isEnabled = $event"
 *    />
 */
import { ref } from 'vue'

// ── TODO：使用 defineModel 取得雙向綁定的值 ──────────────────
// defineModel() 回傳一個可讀寫的 ref：
//   - 讀取：isOn.value（目前狀態）
//   - 寫入：isOn.value = newVal（自動通知父層 update:modelValue）
//
// 語法：
// const isOn = defineModel({ type: Boolean, default: false })

// ★ 佔位變數（實作 defineModel 後請刪除這行，改用 defineModel 的回傳值）
const isOn = ref(false)

// ── 模擬「父層視角」的示意資料 ───────────────────────────────
// 真實場景中，父層有一個 ref 透過 v-model 與此元件同步
// 因為此元件是直接路由渲染（無父層），我們手動追蹤其值做展示
const parentViewValue = isOn   // 在真實父層中，這會是父層自己的 ref
</script>

<template>
  <div class="toggle-demo">
    <h3>🔀 Q03 — defineModel 練習</h3>

    <!-- ── 元件主體：Toggle 開關 ── -->
    <section class="demo-section">
      <h4>CustomToggle 元件</h4>

      <div class="toggle-wrapper">
        <!--
          TODO：為按鈕加上：
            @click="isOn.value = !isOn.value"
            :class="{ active: isOn.value }"
        -->
        <button class="toggle-btn" @click="">
          <span class="toggle-knob"></span>
        </button>
        <span class="status-label">
          <!-- TODO：將 '？' 替換為 isOn.value ? '✅ 啟用' : '❌ 停用' -->
          狀態：{{ '（實作 defineModel 後顯示）' }}
        </span>
      </div>
    </section>

    <!-- ── 父層視角（模擬 v-model 同步） ── -->
    <section class="demo-section parent-section">
      <h4>父層視角（v-model 綁定的 ref）</h4>
      <p class="hint">完成 defineModel 後，父層的變數會與 toggle 狀態保持同步</p>
      <div class="parent-value">
        <code>isEnabled.value = {{ parentViewValue }}</code>
      </div>
      <div class="usage-example">
        <p>父層使用方式：</p>
        <pre class="code-block">&lt;!-- 父層 --&gt;
const isEnabled = ref(false)

&lt;CustomToggle v-model="isEnabled" /&gt;
&lt;p&gt;目前狀態：&#123;&#123; isEnabled &#125;&#125;&lt;/p&gt;</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.toggle-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.toggle-wrapper { display: flex; align-items: center; gap: var(--space-md); }
.toggle-btn { width: 56px; height: 30px; border-radius: 15px; border: none; background: var(--color-border); cursor: pointer; position: relative; transition: background 0.3s; padding: 0; }
.toggle-btn.active { background: var(--color-primary); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: white; transition: transform 0.3s; display: block; }
.toggle-btn.active .toggle-knob { transform: translateX(26px); }
.status-label { font-weight: 500; font-size: var(--font-size-lg); }
.parent-section { border-color: var(--color-secondary); }
.parent-value { font-family: var(--font-mono); background: var(--color-bg); padding: var(--space-sm) var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.usage-example { margin-top: var(--space-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 4px 0 0; }
</style>

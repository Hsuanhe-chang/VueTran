<script setup>
/** Q04 — 預設插槽與具名插槽（解答）
 *
 *  核心概念：
 *  - <slot> 預設插槽：父層直接放在子元件標籤內的內容
 *  - <slot name="xxx"> 具名插槽：父層用 <template #xxx> 指定內容放哪
 *  - <slot> 標籤內的內容是「備援內容（fallback）」，父層不傳時顯示
 *  - 同一元件可有多個具名插槽，但預設插槽只能有一個
 */
</script>

<template>
  <div class="slots-demo">
    <h3>🧩 Q04 — Slots 解答</h3>

    <!-- ── SectionCard 元件本體（完整實作） ── -->
    <div class="section-card">

      <!-- 具名插槽 header：父層用 <template #header> 傳入標題 -->
      <div class="card-header">
        <slot name="header">（請插入標題）</slot>
      </div>

      <!-- 預設插槽 default：父層直接放在 SectionCard 標籤內的內容 -->
      <div class="card-body">
        <slot>（此處可插入任意內容）</slot>
      </div>

      <!-- 具名插槽 footer：父層用 <template #footer> 傳入頁尾操作 -->
      <div class="card-footer">
        <slot name="footer">（請插入頁尾操作）</slot>
      </div>
    </div>

    <!-- ── 解答說明 ── -->
    <div class="answer-block card">
      <h5>✅ 完整的 slot 使用說明</h5>
      <pre class="code-block">// ── 子元件定義 slots ──
&lt;div class="card-header"&gt;
  &lt;slot name="header"&gt;備援標題&lt;/slot&gt;     &lt;!-- 具名插槽 --&gt;
&lt;/div&gt;
&lt;div class="card-body"&gt;
  &lt;slot&gt;備援內容&lt;/slot&gt;                    &lt;!-- 預設插槽 --&gt;
&lt;/div&gt;
&lt;div class="card-footer"&gt;
  &lt;slot name="footer"&gt;備援頁尾&lt;/slot&gt;     &lt;!-- 具名插槽 --&gt;
&lt;/div&gt;

// ── 父層傳入內容 ──
&lt;SectionCard&gt;
  &lt;template #header&gt;
    &lt;h2&gt;我的標題&lt;/h2&gt;          &lt;!-- 插入 header slot --&gt;
  &lt;/template&gt;

  &lt;p&gt;這是內容&lt;/p&gt;              &lt;!-- 插入 default slot --&gt;

  &lt;template #footer&gt;
    &lt;button&gt;確認&lt;/button&gt;       &lt;!-- 插入 footer slot --&gt;
  &lt;/template&gt;
&lt;/SectionCard&gt;</pre>
    </div>
  </div>
</template>

<style scoped>
.slots-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h5 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.section-card { border: 2px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.card-header { background: var(--color-secondary); color: white; padding: var(--space-md) var(--space-lg); min-height: 52px; display: flex; align-items: center; font-weight: 600; }
.card-body { padding: var(--space-lg); min-height: 120px; color: var(--color-text-muted); background: var(--color-bg); }
.card-footer { background: var(--color-bg-card); padding: var(--space-sm) var(--space-lg); min-height: 48px; display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid var(--color-border); color: var(--color-text-muted); font-size: var(--font-size-sm); }
.answer-block { display: flex; flex-direction: column; gap: var(--space-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

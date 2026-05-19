<script setup lang="ts">
/** Q04 — 預設插槽與具名插槽（填空）
 *  你正在實作 SectionCard 版面元件。
 *  父層這樣使用它：
 *
 *    <SectionCard>
 *      <template #header>
 *        <h2>自訂標題</h2>
 *      </template>
 *
 *      <p>這裡是卡片的主要內容</p>
 *
 *      <template #footer>
 *        <button>確認</button>
 *      </template>
 *    </SectionCard>
 *
 *  此元件只負責提供版面容器，不決定顯示什麼內容。
 */

// 此元件沒有 script 邏輯，僅透過 slots 接受外部內容
</script>

<template>
  <div class="slots-demo">
    <h3>🧩 Q04 — Slots 練習</h3>

    <!-- ── SectionCard 元件本體 ── -->
    <div class="section-card">

      <!-- 標題列 -->
      <div class="card-header">
        <!--
          TODO 1：加入具名插槽 header
          語法：<slot name="header">備援文字</slot>
          備援文字：「（請插入標題）」
        -->
      </div>

      <!-- 內容區 -->
      <div class="card-body">
        <!--
          TODO 2：加入預設插槽（不需要 name 屬性）
          語法：<slot>備援文字</slot>
          備援文字：「（此處可插入任意內容）」
        -->
      </div>

      <!-- 頁尾列 -->
      <div class="card-footer">
        <!--
          TODO 3：加入具名插槽 footer
          語法：<slot name="footer">備援文字</slot>
          備援文字：「（請插入頁尾操作）」
        -->
      </div>
    </div>

    <!-- ── 完成後效果說明 ── -->
    <div class="hint-card card">
      <p class="hint">
        ✅ 加入 slot 標籤後，當前頁面（無父層傳入）應顯示各區域的備援文字。<br>
        ✅ 在真實父層中，子元素會取代備援文字出現在對應位置。
      </p>
      <p class="hint">父層使用範例：</p>
      <pre class="code-block">&lt;SectionCard&gt;
  &lt;template #header&gt;&lt;h2&gt;我的標題&lt;/h2&gt;&lt;/template&gt;
  &lt;p&gt;內容段落&lt;/p&gt;
  &lt;template #footer&gt;&lt;button&gt;確認&lt;/button&gt;&lt;/template&gt;
&lt;/SectionCard&gt;</pre>
    </div>
  </div>
</template>

<style scoped>
.slots-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.section-card { border: 2px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.card-header { background: var(--color-secondary); color: white; padding: var(--space-md) var(--space-lg); min-height: 52px; display: flex; align-items: center; font-weight: 600; }
.card-body { padding: var(--space-lg); min-height: 120px; color: var(--color-text-muted); background: var(--color-bg); }
.card-footer { background: var(--color-bg-card); padding: var(--space-sm) var(--space-lg); min-height: 48px; display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid var(--color-border); color: var(--color-text-muted); font-size: var(--font-size-sm); }
.hint-card { display: flex; flex-direction: column; gap: var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

<script setup>
/** Q05 — Scoped Slots（作用域插槽）（解答）
 *
 *  核心概念：
 *  - Scoped slot 讓子元件把「自己的資料」暴露給父層的插槽模板使用
 *  - 子元件：<slot :item="item" :index="index"> 暴露 slot props
 *  - 父層：<template #default="{ item, index }"> 接收 slot props
 *  - 用途：子元件控制「迭代邏輯」，父層控制「渲染外觀」
 */
import { ref } from 'vue'
import DataList from './_DataList.vue'

const courses = ref([
  { id: 1, name: 'Vue 3 完整課程', price: 799, level: '入門', enrolled: 1250 },
  { id: 2, name: 'React 18 實戰', price: 599, level: '中級', enrolled: 890 },
  { id: 3, name: 'TypeScript 全攻略', price: 499, level: '進階', enrolled: 675 },
])
</script>

<template>
  <div class="scoped-slots-demo">
    <h3>🎯 Q05 — Scoped Slots 解答</h3>

    <!-- ── 完整實作 ── -->
    <section class="demo-section">
      <h4>課程目錄（完整 Scoped Slot 用法）</h4>

      <!--
        父層透過 #default="{ item, index }" 接收 DataList 暴露的 slot props
        DataList 負責迭代，父層決定每一列的顯示樣式
      -->
      <DataList :items="courses">
        <!-- #default 是 v-slot:default 的簡寫 -->
        <template #default="{ item, index }">
          <div class="course-row">
            <!-- 序號 -->
            <span class="rank">{{ index + 1 }}</span>

            <!-- 課程名稱與等級 -->
            <div class="course-info">
              <span class="course-name">{{ item.name }}</span>
              <span :class="['level-badge', `level-${item.level}`]">{{ item.level }}</span>
            </div>

            <!-- 報名人數與價格 -->
            <div class="course-meta">
              <span class="enrolled">👥 {{ item.enrolled }} 人</span>
              <span class="price">NT$ {{ item.price }}</span>
            </div>
          </div>
        </template>
      </DataList>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section answer-section">
      <h4>✅ Scoped Slot 完整說明</h4>
      <pre class="code-block">// ── 子元件（_DataList.vue）：暴露 slot props ──
&lt;li v-for="(item, index) in items" :key="item.id"&gt;
  &lt;slot :item="item" :index="index"&gt;
    備援內容（父層未傳 slot 時顯示）
  &lt;/slot&gt;
&lt;/li&gt;

// ── 父層：接收 slot props ──
&lt;DataList :items="courses"&gt;
  &lt;template #default="{ item, index }"&gt;
    &lt;!-- 父層決定渲染格式 --&gt;
    &#123;&#123; index + 1 &#125;&#125;. &#123;&#123; item.name &#125;&#125;
  &lt;/template&gt;
&lt;/DataList&gt;</pre>
    </section>
  </div>
</template>

<style scoped>
.scoped-slots-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.course-row { display: flex; align-items: center; gap: var(--space-md); padding: 10px 14px; }
.rank { font-family: var(--font-mono); font-weight: 700; color: var(--color-text-muted); min-width: 2ch; }
.course-info { flex: 1; display: flex; align-items: center; gap: var(--space-sm); }
.course-name { font-weight: 600; }
.level-badge { font-size: var(--font-size-sm); padding: 2px 8px; border-radius: 20px; }
.level-入門 { background: rgba(66,184,131,0.15); color: var(--color-primary); }
.level-中級 { background: rgba(59,130,246,0.15); color: #3b82f6; }
.level-進階 { background: rgba(168,85,247,0.15); color: #a855f7; }
.course-meta { display: flex; align-items: center; gap: var(--space-md); }
.enrolled { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price { font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

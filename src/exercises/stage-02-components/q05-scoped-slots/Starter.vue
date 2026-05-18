<script setup>
/** Q05 — Scoped Slots（作用域插槽）（從零撰寫）
 *  DataList 元件透過 scoped slot 暴露每個 item 和 index，
 *  你（父層）需要用 v-slot 接收並自訂渲染方式。
 */
import { ref } from 'vue'
// 匯入已提供的 DataList 元件（不需修改這個元件）
import DataList from './_DataList.vue'

// 課程資料：DataList 會迭代這個陣列，透過 scoped slot 傳給你
const courses = ref([
  { id: 1, name: 'Vue 3 完整課程', price: 799, level: '入門', enrolled: 1250 },
  { id: 2, name: 'React 18 實戰', price: 599, level: '中級', enrolled: 890 },
  { id: 3, name: 'TypeScript 全攻略', price: 499, level: '進階', enrolled: 675 },
])
</script>

<template>
  <div class="scoped-slots-demo">
    <h3>🎯 Q05 — Scoped Slots 練習</h3>

    <!-- ── 練習區 ── -->
    <section class="demo-section">
      <h4>課程目錄（使用 DataList + Scoped Slot）</h4>
      <p class="hint">
        DataList 元件會迭代 courses，並透過 scoped slot 暴露 item 和 index。<br>
        請用 v-slot 接收它們，並自訂每一列的顯示格式。
      </p>

      <!--
        TODO：在 DataList 內加入 <template> 使用 v-slot 接收 slot props
        目標寫法：
          <DataList :items="courses">
            <template #default="{ item, index }">
              ...你的自訂渲染...
            </template>
          </DataList>

        顯示要求：
          序號（index + 1）、課程名稱（item.name）、等級（item.level）、價格（item.price）
      -->
      <DataList :items="courses">
        <!-- 目前顯示的是 _DataList.vue 的備援文字 -->
        <!-- TODO：在此加入 <template #default="{ item, index }"> 區塊 -->
      </DataList>
    </section>
  </div>
</template>

<style scoped>
.scoped-slots-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
</style>

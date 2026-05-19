<script setup lang="ts">
/** _DataList.vue — 已提供的資料列表元件（不需修改）
 *  透過 scoped slot 將每個 item 和 index 暴露給父層，
 *  讓父層自訂每一列的渲染方式。
 *
 *  父層使用方式：
 *    <DataList :items="courses">
 *      <template #default="{ item, index }">
 *        <span>{{ index + 1 }}. {{ item.name }}</span>
 *      </template>
 *    </DataList>
 */
// 定義通用資料項目的基底型別：必須包含 id 欄位，其他屬性任意
interface DataItem {
  id: string | number
  [key: string]: unknown  // 允許任意額外屬性，保持元件的通用性
}

defineProps<{
  items: DataItem[]  // 使用型別語法，讓 slot 的 item 獲得正確型別
}>()
</script>

<template>
  <ul class="data-list">
    <!-- 迭代每個 item，透過 scoped slot 暴露 item 和 index 給父層 -->
    <li
      v-for="(item, index) in items"
      :key="item.id"
      class="data-item"
    >
      <!--
        scoped slot：將 item 和 index 作為 slot props 暴露出去
        父層用 v-slot="{ item, index }" 接收
      -->
      <slot :item="item" :index="index">
        <!-- 備援內容：父層沒有傳入 slot 模板時顯示 -->
        <span class="fallback">{{ index + 1 }}. {{ item.name ?? item.id }}</span>
      </slot>
    </li>
  </ul>
</template>

<style scoped>
.data-list { list-style: none; display: flex; flex-direction: column; gap: 6px; padding: 0; margin: 0; }
.data-item { border: 1px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden; }
.fallback { display: block; padding: 10px 14px; color: var(--color-text-muted); font-style: italic; }
</style>

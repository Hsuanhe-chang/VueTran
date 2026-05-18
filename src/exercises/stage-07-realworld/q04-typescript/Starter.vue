<script setup>
/** Q04 — TypeScript 與 Vue 3 整合（JSDoc 型別 + defineProps 驗證）（練習）
 *
 *  本專案使用 JavaScript，透過 JSDoc 與 defineProps validator 增加型別安全。
 *
 *  TODO 1：在檔案頂部用 @typedef 定義 User 型別物件
 *  TODO 2：為 defineProps 加入 type / required / validator 設定
 *  TODO 3：為主要函式加入 @param / @returns JSDoc 標註
 *
 *  注意：重構不改變元件的視覺與功能行為，只增加型別標註
 */

// TODO 1：加入 @typedef 定義 User 型別
// /**
//  * @typedef {{ id: number, name: string, email: string, role: 'admin' | 'editor' | 'viewer', createdAt: string }} User
//  */

// TODO 2：為 defineProps 加入完整型別驗證
// 提示：role 應有 validator 限定合法值 ['admin', 'editor', 'viewer']
const props = defineProps({
  // 目前沒有 type / required / validator → 請重構
  user:     {},
  readonly: {}
})

// TODO 3：為這個函式加入 JSDoc 標註
// /**
//  * @param {User} user
//  * @returns {string}
//  */
function formatUserLabel(user) {
  return `${user.name} <${user.email}>`
}

// 角色對應的顯示顏色
const ROLE_COLORS = {
  admin:  'var(--color-primary)',
  editor: '#16a34a',
  viewer: '#64748b'
}

function getRoleColor(role) {
  return ROLE_COLORS[role] ?? '#64748b'
}
</script>

<template>
  <div class="ts-demo">
    <h3>🔷 Q04 — TypeScript 整合（練習）</h3>

    <section class="demo-section">
      <h4>使用者卡片元件</h4>
      <p class="hint">此元件接受 <code>user</code> prop，顯示使用者資訊</p>

      <!-- 展示卡片（用假資料預覽）-->
      <div class="preview-area">
        <div class="user-card">
          <div class="card-avatar">{{ props.user?.name?.[0] ?? 'U' }}</div>
          <div class="card-info">
            <p class="card-name">{{ props.user?.name ?? '使用者名稱' }}</p>
            <p class="card-email">{{ props.user?.email ?? 'user@example.com' }}</p>
            <span
              class="card-role"
              :style="{ color: getRoleColor(props.user?.role ?? 'viewer') }"
            >{{ props.user?.role ?? 'viewer' }}</span>
          </div>
          <span v-if="props.readonly" class="readonly-badge">唯讀</span>
        </div>
        <p class="card-label">{{ formatUserLabel(props.user ?? { name: '王小明', email: 'ming@example.com' }) }}</p>
      </div>
    </section>

    <!-- 重構說明 -->
    <section class="demo-section">
      <h4>重構目標：從「無型別」到「有型別保障」</h4>
      <pre v-pre class="code-block">// ❌ 重構前（無型別，IDE 無法推斷）
const props = defineProps({ user: {}, readonly: {} })

// ✅ 重構後（有型別 + validator）
/**
 * @typedef {{ id: number, name: string, email: string,
 *             role: 'admin' | 'editor' | 'viewer' }} User
 */
const props = defineProps({
  user: {
    type: Object,
    required: true,
    /** @param {unknown} val */
    validator: (val) => val && typeof val.name === 'string'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

// 函式加上 JSDoc
/**
 * @param {User} user
 * @returns {string}
 */
function formatUserLabel(user) { ... }</pre>
    </section>

    <!-- TypeScript 版本對照 -->
    <section class="demo-section">
      <h4>TypeScript 版本對照（lang="ts"）</h4>
      <pre v-pre class="code-block">// 若專案有 TypeScript（lang="ts"）
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: string
}

const props = defineProps&lt;{
  user: User
  readonly?: boolean
}&gt;()

// 帶預設值
const { user, readonly = false } = defineProps&lt;{
  user: User
  readonly?: boolean
}&gt;()</pre>
    </section>
  </div>
</template>

<style scoped>
.ts-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
code { background: var(--color-border); padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.preview-area { display: flex; flex-direction: column; gap: var(--space-sm); }
.user-card { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); max-width: 360px; position: relative; }
.card-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.card-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.card-name { font-weight: 700; font-size: var(--font-size-sm); margin: 0; }
.card-email { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
.card-role { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.readonly-badge { font-size: 0.7rem; padding: 2px 6px; background: #f1f5f9; color: #64748b; border-radius: 4px; border: 1px solid var(--color-border); }
.card-label { font-size: 0.8rem; color: var(--color-text-muted); font-family: var(--font-mono); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

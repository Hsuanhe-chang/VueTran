<script setup>
/** Q04 — TypeScript 與 Vue 3 整合（JSDoc 型別 + defineProps 驗證）（解答）
 *
 *  TODO 解答：
 *  1. @typedef 定義 User 型別（IDE IntelliSense 可推斷）
 *  2. defineProps 加入 type / required / default / validator
 *  3. 函式加上 @param / @returns JSDoc 標註
 */

/**
 * ✅ TODO 1：JSDoc @typedef 定義 User 型別
 * IDE（VSCode + Volar）會根據此定義提供型別推斷與自動補全
 *
 * @typedef {{
 *   id: number,
 *   name: string,
 *   email: string,
 *   role: 'admin' | 'editor' | 'viewer',
 *   createdAt: string
 * }} User
 */

// ✅ TODO 2：defineProps 加入完整型別驗證
const props = defineProps({
  /**
   * 使用者物件（必填）
   * @type {{ type: ObjectConstructor, required: true, validator: (val: unknown) => boolean }}
   */
  user: {
    type: Object,
    required: true,
    // validator 在 dev mode 執行，props 不符合時 console 警告
    validator: (val) => {
      if (!val || typeof val !== 'object') return false
      const validRoles = ['admin', 'editor', 'viewer']
      return (
        typeof val.name === 'string' &&
        typeof val.email === 'string' &&
        validRoles.includes(val.role)
      )
    }
  },
  /**
   * 是否為唯讀模式（選填，預設 false）
   */
  readonly: {
    type: Boolean,
    default: false
  }
})

// ✅ TODO 3：函式 JSDoc 標註
/**
 * 將使用者物件格式化為顯示字串
 * @param {User} user - 使用者物件
 * @returns {string} 格式化後的標籤字串
 */
function formatUserLabel(user) {
  return `${user.name} <${user.email}>`
}

/**
 * 根據角色取得對應顯示顏色
 * @param {'admin' | 'editor' | 'viewer'} role
 * @returns {string} CSS color 值
 */
function getRoleColor(role) {
  const ROLE_COLORS = {
    admin:  'var(--color-primary)',
    editor: '#16a34a',
    viewer: '#64748b'
  }
  return ROLE_COLORS[role] ?? '#64748b'
}

// 預覽用假資料（實際使用時由父元件傳入）
const previewUser = {
  id: 1, name: '王小明', email: 'ming@example.com',
  role: 'admin', createdAt: '2024-01-15'
}
</script>

<template>
  <div class="ts-demo">
    <h3>🔷 Q04 — TypeScript 整合（解答）</h3>

    <section class="demo-section">
      <h4>使用者卡片（已加入型別標註）</h4>

      <!-- 使用 previewUser 預覽（因無父元件傳 props）-->
      <div class="preview-area">
        <div class="user-card">
          <div class="card-avatar">{{ previewUser.name[0] }}</div>
          <div class="card-info">
            <p class="card-name">{{ previewUser.name }}</p>
            <p class="card-email">{{ previewUser.email }}</p>
            <span
              class="card-role"
              :style="{ color: getRoleColor(previewUser.role) }"
            >{{ previewUser.role }}</span>
          </div>
          <span v-if="props.readonly" class="readonly-badge">唯讀</span>
        </div>
        <p class="card-label">{{ formatUserLabel(previewUser) }}</p>
      </div>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ JSDoc + defineProps validator 解答</h4>
      <pre v-pre class="code-block">/**
 * @typedef {{ id: number, name: string, email: string,
 *             role: 'admin' | 'editor' | 'viewer' }} User
 */

const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (val) => {
      const validRoles = ['admin', 'editor', 'viewer']
      return typeof val.name === 'string' && validRoles.includes(val.role)
    }
  },
  readonly: { type: Boolean, default: false }
})

/**
 * @param {User} user
 * @returns {string}
 */
function formatUserLabel(user) {
  return `${user.name} <${user.email}>`
}</pre>
    </section>

    <!-- TypeScript 版本對照 -->
    <section class="demo-section">
      <h4>TypeScript 版本（lang="ts"）對照</h4>
      <pre v-pre class="code-block">// &lt;script setup lang="ts"&gt;
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

// 泛型語法（編譯期型別檢查）
const props = defineProps&lt;{
  user: User
  readonly?: boolean
}&gt;()

// 帶預設值寫法
const { user, readonly = false } = withDefaults(
  defineProps&lt;{ user: User; readonly?: boolean }&gt;(),
  { readonly: false }
)</pre>
    </section>
  </div>
</template>

<style scoped>
.ts-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
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

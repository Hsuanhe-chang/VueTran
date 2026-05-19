<script setup lang="ts">
/** Q03 — 表單驗證（原生 Vue 響應式驗證）（解答）
 *
 *  TODO 解答：
 *  1. form reactive 物件
 *  2. touched reactive 物件（blur 時設 true）
 *  3. errors computed（touched + 驗證規則）
 *  4. handleSubmit（強制 touch 全部 → 有錯停止 → 顯示成功）
 *
 *  重點：
 *  - 用 touch 追蹤避免「初始即顯示錯誤」的壞 UX
 *  - computed errors 響應式重算，不需要手動呼叫驗證函式
 */
import { computed, reactive, ref } from 'vue'

// ✅ TODO 1：表單資料
const form = reactive({
  name:     '',
  email:    '',
  password: '',
  role:     'viewer'
})

// ✅ TODO 2：Touch 追蹤
// 只有被使用者碰過（blur）的欄位才顯示錯誤，避免初始紅燈
const touched = reactive({
  name: false, email: false, password: false
})

// ✅ TODO 3：計算錯誤訊息
const errors = computed(() => {
  // Record<string, string> 明確宣告 e 可接受任意字串 key，避免 TypeScript 索引錯誤
  const e: Record<string, string> = {}

  // 姓名：必填且至少 2 字
  if (touched.name) {
    if (!form.name.trim())
      e.name = '姓名為必填'
    else if (form.name.trim().length < 2)
      e.name = '姓名至少需要 2 個字'
  }

  // Email：必填且格式正確
  if (touched.email) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email)
      e.email = 'Email 為必填'
    else if (!emailRe.test(form.email))
      e.email = '請輸入有效的 Email 格式'
  }

  // 密碼：必填且至少 8 碼
  if (touched.password) {
    if (!form.password)
      e.password = '密碼為必填'
    else if (form.password.length < 8)
      e.password = '密碼至少需要 8 碼'
  }

  return e
})

// 是否有任何驗證錯誤
const hasErrors = computed(() => Object.keys(errors.value).length > 0)

// ✅ TODO 4：送出處理
const submitResult = ref('')

function handleSubmit() {
  // 步驟 1：強制 touch 所有欄位（讓未碰過的空白欄位也顯示錯誤）
  // keyof typeof touched 確保 k 對應 touched 的已知 key，避免字串索引錯誤
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = true))

  // 步驟 2：有驗證錯誤 → 停止，不送出
  if (hasErrors.value) return

  // 步驟 3：所有驗證通過，模擬送出成功
  submitResult.value = `✅ 送出成功！姓名：${form.name}，Email：${form.email}，角色：${form.role}`
}

// 欄位 blur 時標記為 touched（觸發驗證顯示）
// keyof typeof touched 限定 field 必須是 touched 的已知鍵名（'name' | 'email' | 'password'）
function touch(field: keyof typeof touched): void {
  touched[field] = true
}
</script>

<template>
  <div class="form-demo">
    <h3>📝 Q03 — 表單驗證（解答）</h3>

    <section class="demo-section">
      <h4>使用者註冊表單（含完整驗證）</h4>

      <form class="reg-form" @submit.prevent="handleSubmit" novalidate>

        <!-- 姓名 -->
        <div class="field-group" :class="{ error: errors.name }">
          <label class="field-label">姓名 <span class="required">*</span></label>
          <input
            v-model="form.name"
            class="field-input"
            type="text"
            placeholder="請輸入姓名（至少 2 字）"
            @blur="touch('name')"
          />
          <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="field-group" :class="{ error: errors.email }">
          <label class="field-label">Email <span class="required">*</span></label>
          <input
            v-model="form.email"
            class="field-input"
            type="email"
            placeholder="example@domain.com"
            @blur="touch('email')"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <!-- 密碼 -->
        <div class="field-group" :class="{ error: errors.password }">
          <label class="field-label">密碼 <span class="required">*</span></label>
          <input
            v-model="form.password"
            class="field-input"
            type="password"
            placeholder="至少 8 碼"
            @blur="touch('password')"
          />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <!-- 角色 -->
        <div class="field-group">
          <label class="field-label">角色</label>
          <select v-model="form.role" class="field-select">
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- 錯誤統計（送出後） -->
        <p v-if="hasErrors && touched.name" class="form-summary-error">
          ⚠️ 請修正上方 {{ Object.keys(errors).length }} 個錯誤
        </p>

        <button type="submit" class="btn btn-submit">送出表單</button>

        <p v-if="submitResult" class="submit-result">{{ submitResult }}</p>
      </form>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ 驗證模式解答</h4>
      <pre v-pre class="code-block">// ① form 資料
const form = reactive({ name: '', email: '', password: '', role: 'viewer' })

// ② touch 追蹤（blur 時設 true → 才顯示錯誤）
const touched = reactive({ name: false, email: false, password: false })

// ③ computed errors（響應式，自動重算）
const errors = computed(() => {
  const e = {}
  if (touched.name && !form.name.trim())       e.name = '姓名為必填'
  if (touched.email && !/^[^\s@]+@/.test(form.email)) e.email = '格式錯誤'
  if (touched.password && form.password.length < 8) e.password = '至少 8 碼'
  return e
})

// ④ handleSubmit
function handleSubmit() {
  Object.keys(touched).forEach(k => (touched[k] = true))  // 強制 touch 全部
  if (hasErrors.value) return                              // 有錯 → 停止
  // ✅ 送出成功
}</pre>
    </section>
  </div>
</template>

<style scoped>
.form-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.reg-form { display: flex; flex-direction: column; gap: var(--space-md); max-width: 440px; }
.field-group { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text); }
.required { color: #ef4444; }
.field-input, .field-select { padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-family: inherit; transition: border-color 0.2s; }
.field-input:focus, .field-select:focus { outline: none; border-color: var(--color-primary); }
.field-group.error .field-input,
.field-group.error .field-select { border-color: #ef4444; }
.field-error { font-size: 0.8rem; color: #ef4444; margin: 0; }
.form-summary-error { font-size: var(--font-size-sm); color: #dc2626; }
.btn { padding: 10px 24px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; }
.btn-submit { background: var(--color-primary); color: #fff; align-self: flex-start; }
.submit-result { font-size: var(--font-size-sm); font-weight: 500; padding: 8px 12px; background: rgba(22,163,74,0.08); border-radius: var(--radius-sm); border: 1px solid rgba(22,163,74,0.3); color: #16a34a; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

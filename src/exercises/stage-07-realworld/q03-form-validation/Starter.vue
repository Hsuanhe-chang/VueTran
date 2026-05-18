<script setup>
/** Q03 — 表單驗證（原生 Vue 響應式驗證）（練習）
 *
 *  不依賴第三方驗證庫，用 Vue 響應式 API 自行實作表單驗證。
 *  核心：touch 追蹤 + computed errors + submit 時強制觸碰所有欄位
 *
 *  TODO 1：建立 form reactive 物件（name / email / password / role）
 *  TODO 2：建立 touched reactive 物件（追蹤哪些欄位被使用者碰過）
 *  TODO 3：建立 errors computed（根據 form + touched 計算錯誤訊息）
 *  TODO 4：實作 handleSubmit()（強制 touch 全部 → 有錯停止 → 成功訊息）
 */
import { computed, reactive, ref } from 'vue'

// ── TODO 1：表單資料 ─────────────────────────────────────
// const form = reactive({
//   name:     '',
//   email:    '',
//   password: '',
//   role:     'viewer'
// })

// ── TODO 2：Touch 追蹤（blur 時設為 true，只有碰過的欄位才顯示錯誤）
// const touched = reactive({
//   name: false, email: false, password: false
// })

// ── TODO 3：計算各欄位的錯誤訊息 ────────────────────────
// const errors = computed(() => {
//   const e = {}
//
//   // 姓名：必填，最少 2 字
//   if (touched.name) {
//     if (!form.name.trim())        e.name = '姓名為必填'
//     else if (form.name.length < 2) e.name = '姓名至少需要 2 個字'
//   }
//
//   // Email：必填，需符合 email 格式
//   if (touched.email) {
//     const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!form.email)              e.email = 'Email 為必填'
//     else if (!emailRe.test(form.email)) e.email = '請輸入有效的 Email 格式'
//   }
//
//   // 密碼：必填，最少 8 碼
//   if (touched.password) {
//     if (!form.password)              e.password = '密碼為必填'
//     else if (form.password.length < 8) e.password = '密碼至少需要 8 碼'
//   }
//
//   return e
// })

// 是否有任何錯誤
// const hasErrors = computed(() => Object.keys(errors.value).length > 0)

// 暫時空佔位（完成 TODO 後請刪除）
const form    = reactive({ name: '', email: '', password: '', role: 'viewer' })
const touched = reactive({ name: false, email: false, password: false })
const errors  = computed(() => ({}))
const hasErrors = computed(() => false)

// ── TODO 4：送出處理 ─────────────────────────────────────
const submitResult = ref('')

function handleSubmit() {
  // TODO 4：
  // 1. 強制 touch 所有欄位（讓未填的欄位也顯示錯誤）
  // Object.keys(touched).forEach(k => (touched[k] = true))
  //
  // 2. 若有錯誤，阻止繼續
  // if (hasErrors.value) return
  //
  // 3. 模擬送出成功
  // submitResult.value = `✅ 送出成功！姓名：${form.name}，Email：${form.email}`

  submitResult.value = '⚠️ 尚未實作 handleSubmit（完成 TODO 4）'
}

// 欄位 blur 時標記為 touched
function touch(field) {
  touched[field] = true
}
</script>

<template>
  <div class="form-demo">
    <h3>📝 Q03 — 表單驗證（練習）</h3>

    <section class="demo-section">
      <h4>使用者註冊表單</h4>

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
          <!-- 錯誤訊息：有 errors.name 才顯示 -->
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

        <!-- 送出 -->
        <button type="submit" class="btn btn-submit">
          送出表單
        </button>

        <!-- 結果訊息 -->
        <p v-if="submitResult" class="submit-result">{{ submitResult }}</p>
      </form>
    </section>

    <!-- 驗證邏輯提示 -->
    <section class="demo-section">
      <h4>驗證邏輯提示</h4>
      <pre v-pre class="code-block">// 驗證規則
姓名：trim() 後非空，且長度 >= 2
Email：非空，且符合 /^[^\s@]+@[^\s@]+\.[^\s@]+$/
密碼：非空，且長度 >= 8

// handleSubmit 流程
1. Object.keys(touched).forEach(k => touched[k] = true)  // 強制 touch 全部
2. if (hasErrors.value) return                             // 有錯 → 停止
3. submitResult.value = '✅ 送出成功！'                   // 成功</pre>
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
.btn { padding: 10px 24px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; }
.btn-submit { background: var(--color-primary); color: #fff; align-self: flex-start; }
.submit-result { font-size: var(--font-size-sm); font-weight: 500; padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

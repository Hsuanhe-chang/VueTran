<script setup>
/**
 * Q02 — reactive 與巢狀物件響應性
 * Part A（填空）：完成 reactive 物件操作
 * Part B（找錯誤）：找出並說明 2 個 bug
 */
import { reactive } from 'vue'

// ─── Part A：填空 ────────────────────────────────────────
// ✅ user 已用 reactive() 建立，直接修改屬性即可（不需要 .value）
const user = reactive({
  name: 'Vue 學習者',
  age: 25,
  email: 'learner@vue.dev',
})

// TODO 1: 實作 birthday() — 讓 user.age 加 1
//         提示：user.age++  （reactive 屬性不需要 .value）
function birthday() {
  user.age++
}

// TODO 2: 實作 resetUser() — 重置所有欄位回初始值
//         ⚠️ 注意：不能直接寫 user = { ... }，那會失去響應性！
//         正確做法：Object.assign(user, { name: ..., age: ..., email: ... })
function resetUser() {
  Object.assign(user, { name: 'Vue 學習者', age: 25, email: 'learner@vue.dev' })
}

// ─── Part B：找錯誤區 ────────────────────────────────────
// 以下有 2 個 bug，找出並在下方模板中說明原因
const buggyState = reactive({ score: 100, level: 1 })

// Bug 1：以下這樣解構會有什麼問題？
const { score } = buggyState   // 🐛 這樣做會有什麼後果？

// Bug 2：以下這樣重置會有什麼問題？
// （注意：這行在執行時會報錯，因為 const 不能重新賦值）
// buggyState = reactive({ score: 100, level: 1 })  // 🐛 這樣做會怎樣？
</script>

<template>
  <div class="reactive-demo">
    <h3>🧪 reactive 練習</h3>

    <!-- Part A：使用者資料顯示 -->
    <section class="user-section">
      <h4>Part A — 使用者資料</h4>

      <!-- ✅ reactive 屬性在 template 中直接用 user.xxx -->
      <div class="user-info">
        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
        <p>Email：{{ user.email }}</p>
      </div>

      <!-- ✅ v-model 直接綁定 reactive 的屬性 -->
      <label>
        修改姓名：
        <input v-model="user.name" type="text" />
      </label>

      <div class="btn-group">
        <!-- ✅ 事件綁定完成，但 birthday 和 resetUser 函式還是空的 -->
        <button class="btn btn-outline" @click="birthday">🎂 生日 +1 歲</button>
        <button class="btn btn-outline" @click="resetUser">🔄 重置</button>
      </div>
    </section>

    <!-- Part B：Bug 說明區 -->
    <section class="bug-section">
      <h4>Part B — 找到這 2 個 Bug 了嗎？</h4>
      <p>請在此說明 bug 的原因：</p>
      <ol>
        <li>Bug 1：<code>const &#123; score &#125; = buggyState</code> — 問題是？</li>
        <li>Bug 2：<code>buggyState = reactive(...)</code> — 問題是？</li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.reactive-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}

.user-section, .bug-section {
  padding: var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

h4 {
  margin-bottom: var(--space-md);
  color: var(--color-secondary);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

input {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
}

.btn-group {
  display: flex;
  gap: var(--space-sm);
}

.bug-section ol {
  padding-left: var(--space-lg);
  line-height: 2;
  color: var(--color-text-muted);
}
</style>

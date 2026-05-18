<script setup>
/**
 * Q02 — 參考答案：reactive 與巢狀物件響應性
 *
 * Bug 解說：
 *   Bug 1：解構 reactive 物件會「切斷」響應性連結
 *          const { score } = buggyState
 *          → score 只是一個普通的 number，改變 score 不會更新 UI
 *          正確做法：直接用 buggyState.score，或用 toRefs(buggyState)
 *
 *   Bug 2：重新賦值整個 reactive 物件會失去響應性追蹤
 *          buggyState = reactive({ ... })
 *          → Vue 的響應系統只追蹤原本的參照，重新賦值後舊的追蹤就斷了
 *          正確做法：Object.assign(buggyState, { ... })
 */
import { reactive } from 'vue'

// Part A 答案：用 reactive() 建立使用者物件
// reactive() 讓整個物件及其所有屬性都變成響應式
const user = reactive({
  name: 'Vue 學習者',
  age: 25,
  email: 'learner@vue.dev',
})

// birthday：直接修改 reactive 物件的屬性，不需要 .value
function birthday() {
  user.age++
}

// resetUser：使用 Object.assign 修改屬性值，而非重新賦值
// Object.assign(target, source) 會把 source 的屬性複製到 target
// 這樣保留了原本的 reactive 參照，響應性不會中斷
function resetUser() {
  Object.assign(user, {
    name: 'Vue 學習者',
    age: 25,
    email: 'learner@vue.dev',
  })
}
</script>

<template>
  <div class="reactive-demo answer">
    <h3>🧪 reactive 練習（參考答案）</h3>

    <section class="user-section">
      <h4>Part A — 使用者資料</h4>
      <div class="user-info">
        <!-- reactive 物件屬性在 template 中直接用 user.xxx -->
        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
        <p>Email：{{ user.email }}</p>
      </div>

      <!-- v-model 直接綁定 reactive 物件的屬性 -->
      <label>
        修改姓名：
        <input v-model="user.name" type="text" />
      </label>

      <div class="btn-group">
        <button class="btn btn-outline" @click="birthday">🎂 生日 +1 歲</button>
        <button class="btn btn-outline" @click="resetUser">🔄 重置</button>
      </div>
    </section>

    <section class="bug-section">
      <h4>Part B — Bug 解說</h4>
      <dl class="bug-list">
        <dt>Bug 1：<code>const &#123; score &#125; = buggyState</code></dt>
        <dd>
          解構 reactive 物件會讓屬性「脫離」響應系統。<br />
          <code>score</code> 只是 <code>buggyState.score</code> 當下的值（普通 number）。<br />
          修改 <code>score</code> 不會觸發 UI 更新。<br />
          <strong>正確做法：</strong>用 <code>toRefs(buggyState)</code> 或直接存取 <code>buggyState.score</code>
        </dd>
        <dt>Bug 2：<code>buggyState = reactive(...)</code></dt>
        <dd>
          Vue 追蹤的是原本的 reactive 物件參照。<br />
          重新賦值後，原本的追蹤連結斷了，舊的 template binding 仍指向舊物件。<br />
          <strong>正確做法：</strong><code>Object.assign(buggyState, &#123; score: 100, level: 1 &#125;)</code>
        </dd>
      </dl>
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
  border: 2px solid var(--color-primary);
}

.user-section, .bug-section {
  padding: var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

h4 { margin-bottom: var(--space-md); color: var(--color-secondary); }

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

.btn-group { display: flex; gap: var(--space-sm); }

.bug-list { display: flex; flex-direction: column; gap: var(--space-md); }
dt { font-family: var(--font-mono); font-weight: 600; margin-bottom: 4px; }
dd { padding-left: var(--space-md); color: var(--color-text-muted); line-height: 1.8; }
</style>

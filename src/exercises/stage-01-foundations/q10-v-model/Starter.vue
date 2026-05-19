<script setup lang="ts">
/** Q10 — v-model 表單雙向綁定（從零撰寫）
 *  現況：響應式資料已宣告，你需要在 template 中加上 v-model 綁定
 */
import { ref, reactive } from 'vue'

// ✅ 所有響應式資料已宣告
const name = ref('')
const age = ref(18)
const agreed = ref(false)
const interests = ref([])
const gender = ref('')
const city = ref('')
const bio = ref('')

// 整合所有欄位用於 JSON 預覽（不需修改）
const formData = reactive({ name, age, agreed, interests, gender, city, bio })
</script>

<template>
  <div class="form-demo">
    <h3>📋 v-model 表單練習</h3>

    <div class="form-layout">
      <form class="form-section" @submit.prevent>
        <!-- TODO 1: 在 input 上加 v-model="name" -->
        <div class="form-group">
          <label>姓名</label>
          <input type="text" placeholder="請輸入姓名" />
          <!-- ↑ 加 v-model="name" -->
        </div>

        <!-- TODO 2: 在 input 上加 v-model.number="age"（.number 確保類型為 number） -->
        <div class="form-group">
          <label>年齡</label>
          <input type="number" min="0" max="120" />
          <!-- ↑ 加 v-model.number="age" -->
        </div>

        <!-- TODO 3: 在 checkbox 上加 v-model="agreed" -->
        <div class="form-group">
          <label><input type="checkbox" /> 我同意使用條款</label>
          <!-- ↑ checkbox 加 v-model="agreed" -->
        </div>

        <!-- TODO 4: 多選 checkbox — 所有 checkbox 共用 v-model="interests" -->
        <div class="form-group">
          <label>興趣（可多選）</label>
          <div class="checkbox-group">
            <label><input type="checkbox" value="coding" /> 程式設計</label>
            <label><input type="checkbox" value="reading" /> 閱讀</label>
            <label><input type="checkbox" value="gaming" /> 遊戲</label>
            <label><input type="checkbox" value="sports" /> 運動</label>
            <!-- ↑ 所有 checkbox 都加 v-model="interests" -->
          </div>
        </div>

        <!-- TODO 5: radio — 所有 radio 共用 v-model="gender" -->
        <div class="form-group">
          <label>性別</label>
          <div class="radio-group">
            <label><input type="radio" value="male" /> 男</label>
            <label><input type="radio" value="female" /> 女</label>
            <label><input type="radio" value="other" /> 其他</label>
            <!-- ↑ 所有 radio 都加 v-model="gender" -->
          </div>
        </div>

        <!-- TODO 6: select 加 v-model="city" -->
        <div class="form-group">
          <label>所在縣市</label>
          <select>
            <!-- ↑ select 加 v-model="city" -->
            <option value="">請選擇</option>
            <option value="taipei">台北市</option>
            <option value="newTaipei">新北市</option>
            <option value="taichung">台中市</option>
            <option value="kaohsiung">高雄市</option>
          </select>
        </div>

        <!-- TODO 7: textarea 加 v-model="bio" -->
        <div class="form-group">
          <label>自我介紹</label>
          <textarea rows="3" placeholder="請輸入自我介紹..."></textarea>
          <!-- ↑ 加 v-model="bio" -->
        </div>
      </form>

      <!-- 右側：即時資料預覽（加上 v-model 後這裡會自動更新） -->
      <div class="preview-section card">
        <h4>📊 即時資料預覽</h4>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-demo { padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h3 { margin-bottom: var(--space-lg); }
.form-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
.form-section { display: flex; flex-direction: column; gap: var(--space-md); }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group > label { font-weight: 500; font-size: var(--font-size-sm); color: var(--color-text-muted); }
input[type="text"], input[type="number"], select, textarea { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--font-size-base); font-family: inherit; width: 100%; }
.checkbox-group, .radio-group { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.checkbox-group label, .radio-group label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.preview-section h4 { margin-bottom: var(--space-md); }
.preview-section pre { font-family: var(--font-mono); font-size: var(--font-size-sm); background: var(--color-bg); padding: var(--space-md); border-radius: var(--radius-md); white-space: pre-wrap; word-break: break-all; }
</style>

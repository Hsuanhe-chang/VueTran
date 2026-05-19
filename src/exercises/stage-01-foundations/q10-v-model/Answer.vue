<script setup lang="ts">
/** Q10 — 參考答案：v-model 表單雙向綁定 */
import { ref, reactive } from 'vue'

const name = ref('')
const age = ref(18)
const agreed = ref(false)
const interests = ref([])     // 多選 checkbox 綁定陣列
const gender = ref('')
const city = ref('')
const bio = ref('')

// 將所有表單資料整合為可顯示的物件（只為了 JSON 預覽）
const formData = reactive({ name, age, agreed, interests, gender, city, bio })
</script>

<template>
  <div class="form-demo answer">
    <h3>📋 v-model 表單練習（參考答案）</h3>

    <div class="form-layout">
      <form class="form-section" @submit.prevent>
        <div class="form-group">
          <label>姓名</label>
          <input type="text" v-model="name" placeholder="請輸入姓名" />
        </div>

        <div class="form-group">
          <label>年齡</label>
          <!-- .number 修飾符：確保值轉為 number 類型，而非字串 -->
          <input type="number" v-model.number="age" min="0" max="120" />
        </div>

        <div class="form-group">
          <!-- 單一 checkbox：綁定 boolean -->
          <label><input type="checkbox" v-model="agreed" /> 我同意使用條款</label>
        </div>

        <div class="form-group">
          <label>興趣（可多選）</label>
          <div class="checkbox-group">
            <!--
              多選 checkbox：所有 checkbox 共用同一個 ref（interests 陣列）
              選中時，Vue 自動將 value 推入陣列；取消時從陣列移除
            -->
            <label><input type="checkbox" v-model="interests" value="coding" /> 程式設計</label>
            <label><input type="checkbox" v-model="interests" value="reading" /> 閱讀</label>
            <label><input type="checkbox" v-model="interests" value="gaming" /> 遊戲</label>
            <label><input type="checkbox" v-model="interests" value="sports" /> 運動</label>
          </div>
        </div>

        <div class="form-group">
          <label>性別</label>
          <div class="radio-group">
            <!-- radio：所有選項共用同一個 ref，選中者的 value 會被設為 gender.value -->
            <label><input type="radio" v-model="gender" value="male" /> 男</label>
            <label><input type="radio" v-model="gender" value="female" /> 女</label>
            <label><input type="radio" v-model="gender" value="other" /> 其他</label>
          </div>
        </div>

        <div class="form-group">
          <label>所在縣市</label>
          <select v-model="city">
            <option value="">請選擇</option>
            <option value="taipei">台北市</option>
            <option value="newTaipei">新北市</option>
            <option value="taichung">台中市</option>
            <option value="kaohsiung">高雄市</option>
          </select>
        </div>

        <div class="form-group">
          <label>自我介紹</label>
          <textarea v-model="bio" rows="3" placeholder="請輸入自我介紹..."></textarea>
        </div>
      </form>

      <div class="preview-section card">
        <h4>📊 即時資料預覽</h4>
        <!-- JSON.stringify 第二個參數 null, 2 代表縮排 2 格 -->
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-demo { padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
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

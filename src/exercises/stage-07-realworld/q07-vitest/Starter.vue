<script setup lang="ts">
/** Q07 — Vitest 單元測試基礎（練習）
 *
 *  以下三個工具函式各含一個 Bug，導致部分測試失敗。
 *
 *  TODO 1：修正 formatPrice()  — 「非數字回傳 Invalid」測試失敗
 *  TODO 2：修正 validateEmail() — 「@ 前無帳號名」測試失敗
 *  TODO 3：修正 clamp()         — 多個 clamp 測試失敗
 *
 *  點擊「▶ 執行測試」查看結果；修正後重新執行，讓所有 13 個測試通過。
 */
import { ref, computed } from 'vue'

// ── 測試結果的資料結構定義 ──────────────────────────────────
/** 單個測試案例的執行結果 */
interface TestResult {
  name: string
  actual: unknown
  expected: unknown
  pass: boolean
}
/** 測試套件的執行結果 */
interface SuiteResult {
  describe: string
  tests: TestResult[]
}

// ── 受測函式（Subject Under Test）────────────────────────
// 以下三個函式各含一個 Bug，請找出並修正

/**
 * 金額格式化
 * @param {unknown} price    - 金額（應為 number）
 * @param {string} currency - 貨幣代碼（預設 USD）
 * @returns {string}
 *
 * TODO 1：此函式有一個 Bug 導致非數字輸入無法正確處理
 * 提示：格式化前應先驗證 price 的型別
 */
function formatPrice(price: unknown, currency = 'USD'): string {
  // BUG：缺少型別檢查，非數字仍會被格式化成 '$NaN' 而非回傳 'Invalid'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price as number)
}

/**
 * Email 格式驗證
 * @param {string} email
 * @returns {boolean}
 *
 * TODO 2：此函式有一個 Bug 導致不合法的 Email 被視為有效
 * 提示：注意正則表達式中 * 與 + 量詞的差異
 */
function validateEmail(email: string): boolean {
  // BUG：@ 前使用 * 允許零個字元，導致 '@example.com' 通過驗證（應改為 +）
  return /^[^\s@]*@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 將數值限制在 [min, max] 範圍內
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 *
 * TODO 3：此函式有一個 Bug 導致多個測試結果錯誤
 * 提示：Math.min 與 Math.max 的嵌套順序非常重要
 */
function clamp(value: number, min: number, max: number): number {
  // BUG：Math.max 與 Math.min 位置互換，結果完全相反
  return Math.max(Math.min(value, min), max)
}

// ── 模擬測試套件 ─────────────────────────────────────────
// 對應真實 Vitest 的 describe() / it() / expect()
// expected 值均為正確答案，若函式有 Bug 則 actual 與 expected 不符合

/** 深層相等比較（模擬 expect().toEqual()）*/
// a, b: unknown 接受任意型別，避免隐式 any 參數錯誤
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

const testSuites = [
  {
    describe: 'formatPrice()',
    tests: [
      { name: '正數金額',            fn: () => formatPrice(1234.5),   expected: '$1,234.50' },
      { name: '零元',                fn: () => formatPrice(0),         expected: '$0.00'     },
      { name: '非數字回傳 Invalid', fn: () => formatPrice('abc'),     expected: 'Invalid'   },
      { name: '歐元格式化',          fn: () => formatPrice(50, 'EUR'), expected: '€50.00'   },
    ]
  },
  {
    describe: 'validateEmail()',
    tests: [
      { name: '有效 Email',    fn: () => validateEmail('user@example.com'), expected: true  },
      { name: '缺少 @ 符號',  fn: () => validateEmail('invalidemail'),      expected: false },
      { name: '空字串',        fn: () => validateEmail(''),                  expected: false },
      { name: '@ 前無帳號名', fn: () => validateEmail('@example.com'),      expected: false },
    ]
  },
  {
    describe: 'clamp()',
    tests: [
      { name: '值在範圍內', fn: () => clamp(5, 0, 10),    expected: 5  },
      { name: '低於最小值', fn: () => clamp(-5, 0, 10),   expected: 0  },
      { name: '超過最大值', fn: () => clamp(15, 0, 10),   expected: 10 },
      { name: '等於上界',   fn: () => clamp(10, 0, 10),   expected: 10 },
      { name: '負值範圍',   fn: () => clamp(-3, -10, -1), expected: -3 },
    ]
  },
]

// ── 測試執行器狀態 ────────────────────────────────────────
// 加上 SuiteResult[] 泛型，避免 ref([]) 的隱式 any 型別錯誤
const results = ref<SuiteResult[]>([])
const hasRun = ref(false)

/** 執行所有測試並更新 results */
function runTests() {
  results.value = testSuites.map(suite => ({
    describe: suite.describe,
    tests: suite.tests.map(t => {
      let actual, pass
      try {
        actual = t.fn()
        pass = deepEqual(actual, t.expected)
      } catch (e: unknown) {
        // 若函式本身拋錯，標記為失敗並顯示錯誤訊息
        // e: unknown 是 TypeScript 嚴格模式預設，用 instanceof 安全取得 message
        actual = `Error: ${e instanceof Error ? e.message : String(e)}`
        pass = false
      }
      return { name: t.name, actual, expected: t.expected, pass }
    })
  }))
  hasRun.value = true
}

/** 通過數量 */
const passCount = computed(() =>
  results.value.flatMap(s => s.tests).filter(t => t.pass).length
)
/** 總測試數量 */
const totalCount = computed(() =>
  results.value.flatMap(s => s.tests).length
)
/** 是否全部通過 */
const allPass = computed(() =>
  hasRun.value && passCount.value === totalCount.value
)
</script>

<template>
  <div class="vitest-demo">
    <h3>🧪 Q07 — Vitest 單元測試基礎（練習）</h3>

    <!-- 題目說明 -->
    <section class="demo-section">
      <h4>題目說明</h4>
      <p class="hint">
        以下三個函式各含一個 Bug，導致部分測試失敗。<br>
        修正函式後點擊「▶ 執行測試」，讓所有 13 個測試都顯示 ✅ PASS。
      </p>
      <div class="bug-list">
        <span class="bug-tag">Bug 1：formatPrice() — 型別檢查缺失</span>
        <span class="bug-tag">Bug 2：validateEmail() — 正則量詞錯誤</span>
        <span class="bug-tag">Bug 3：clamp() — Math 嵌套順序錯誤</span>
      </div>
    </section>

    <!-- 測試執行區 -->
    <section class="demo-section">
      <div class="run-header">
        <h4>模擬測試執行器</h4>
        <button class="btn" @click="runTests">▶ 執行測試</button>
        <span v-if="hasRun" class="summary" :class="{ 'all-pass': allPass }">
          {{ passCount }}/{{ totalCount }}&nbsp;{{ allPass ? '✅ 全部通過！' : '❌ 有測試失敗' }}
        </span>
      </div>

      <!-- 測試結果列表（執行後才顯示）-->
      <div v-if="hasRun" class="suites">
        <div v-for="suite in results" :key="suite.describe" class="suite">
          <!-- describe 群組標題 -->
          <div class="suite-name">📁 {{ suite.describe }}</div>

          <!-- 每個 it() 測試案例 -->
          <div
            v-for="test in suite.tests"
            :key="test.name"
            class="test-row"
            :class="test.pass ? 'pass' : 'fail'"
          >
            <span class="test-icon">{{ test.pass ? '✅' : '❌' }}</span>
            <span class="test-name">{{ test.name }}</span>
            <!-- 失敗時顯示 actual vs expected 差異 -->
            <span v-if="!test.pass" class="test-detail">
              實際：<code>{{ JSON.stringify(test.actual) }}</code>
              &nbsp;預期：<code>{{ JSON.stringify(test.expected) }}</code>
            </span>
          </div>
        </div>
      </div>

      <p v-else class="hint">點擊按鈕後才會顯示測試結果</p>
    </section>

    <!-- Vitest 安裝與語法說明 -->
    <section class="demo-section">
      <h4>Vitest 真實安裝與設定</h4>
      <pre v-pre class="code-block"># 安裝 Vitest（Vite 專案中）
npm install -D vitest @vue/test-utils

# vite.config.js 加入 test 設定
import { defineConfig } from 'vite'
export default defineConfig({
  test: {
    environment: 'jsdom',  // 模擬瀏覽器 DOM 環境
  }
})

# 執行測試指令
npx vitest          # watch 模式（推薦開發時使用）
npx vitest run      # 只執行一次並退出
npx vitest --ui     # 開啟視覺化 UI 介面</pre>
      <pre v-pre class="code-block">// src/utils/formatters.test.js — 真實 Vitest 語法
import { describe, it, expect } from 'vitest'
import { formatPrice, validateEmail, clamp } from './formatters'

describe('formatPrice()', () => {
  it('正數金額格式化', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50')   // toBe：嚴格 ===
  })
  it('非數字回傳 Invalid', () => {
    expect(formatPrice('abc')).toBe('Invalid')
  })
})

describe('clamp()', () => {
  it.each([
    [5, 0, 10, 5],    // [value, min, max, expected]
    [-5, 0, 10, 0],
    [15, 0, 10, 10],
  ])('clamp(%i, %i, %i) → %i', (value, min, max, expected) => {
    expect(clamp(value, min, max)).toBe(expected)   // 資料驅動測試
  })
})</pre>
    </section>

    <!-- toBe vs toEqual 說明 -->
    <section class="demo-section">
      <h4>toBe vs toEqual 差異</h4>
      <pre v-pre class="code-block">// toBe — 使用 ===，比較參照（適合基本型別：number / string / boolean）
expect(1 + 1).toBe(2)           // ✅ 通過
expect('hello').toBe('hello')   // ✅ 通過
expect({}).toBe({})             // ❌ 失敗！兩個不同的物件參照（地址不同）

// toEqual — 深層比較內容（適合物件、陣列）
expect({ a: 1 }).toEqual({ a: 1 })        // ✅ 通過（內容相同）
expect([1, 2, 3]).toEqual([1, 2, 3])      // ✅ 通過（內容相同）
expect({ a: 1 }).toEqual({ a: 1, b: 2 }) // ❌ 失敗（屬性數量不同）
expect([1, 2]).toEqual([2, 1])            // ❌ 失敗（順序不同）</pre>
    </section>
  </div>
</template>

<style scoped>
.vitest-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.bug-list { display: flex; flex-wrap: wrap; gap: 8px; }
.bug-tag { padding: 4px 10px; background: #fef3c7; color: #92400e; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
.run-header { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.summary { font-weight: 600; font-size: var(--font-size-sm); color: #dc2626; }
.summary.all-pass { color: #16a34a; }
.suites { display: flex; flex-direction: column; gap: var(--space-sm); }
.suite { border: 1px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden; }
.suite-name { padding: 6px 10px; background: var(--color-bg); font-weight: 700; font-size: var(--font-size-sm); color: var(--color-secondary); border-bottom: 1px solid var(--color-border); }
.test-row { display: flex; align-items: center; gap: 8px; padding: 5px 10px; font-size: var(--font-size-sm); flex-wrap: wrap; }
.test-row.pass { background: #f0fdf4; }
.test-row.fail { background: #fef2f2; }
.test-icon { flex-shrink: 0; }
.test-name { flex-shrink: 0; min-width: 130px; }
.test-detail { font-size: 0.78rem; color: #dc2626; }
.test-detail code { background: #fee2e2; padding: 1px 4px; border-radius: 3px; font-family: var(--font-mono); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>

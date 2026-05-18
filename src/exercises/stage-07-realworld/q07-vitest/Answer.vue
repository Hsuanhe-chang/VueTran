<script setup>
/** Q07 — Vitest 單元測試基礎（解答）
 *
 *  TODO 解答：
 *  1. formatPrice() — 加入 typeof price !== 'number' 型別檢查
 *  2. validateEmail() — 將 @ 前的 * 改為 +（要求至少一個字元）
 *  3. clamp() — 修正 Math.min/Math.max 嵌套順序
 */
import { ref, computed } from 'vue'

// ── 受測函式（已修正版本）─────────────────────────────────

/**
 * 金額格式化
 * ✅ 修正 Bug 1：加入 typeof 型別檢查，非數字直接回傳 'Invalid'
 */
function formatPrice(price, currency = 'USD') {
  // 修正：先確認 price 是數字型別，再進行格式化
  if (typeof price !== 'number') return 'Invalid'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)
}

/**
 * Email 格式驗證
 * ✅ 修正 Bug 2：將 @ 前的 * 量詞改為 +，確保 @ 前必須有至少一個字元
 */
function validateEmail(email) {
  // 修正：[^\s@]* → [^\s@]+（+ 要求「一個或多個」，排除 '@example.com' 這類格式）
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 將數值限制在 [min, max] 範圍內
 * ✅ 修正 Bug 3：Math.min 包外層（限制上界），Math.max 包內層（確保下界）
 */
function clamp(value, min, max) {
  // 修正：正確順序 — 先 Math.max(value, min) 確保不低於 min，
  //       再用 Math.min(..., max) 確保不超過 max
  return Math.min(Math.max(value, min), max)
}

// ── 模擬測試套件（與 Starter.vue 相同）─────────────────

function deepEqual(a, b) {
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

const results = ref([])
const hasRun = ref(false)

function runTests() {
  results.value = testSuites.map(suite => ({
    describe: suite.describe,
    tests: suite.tests.map(t => {
      let actual, pass
      try {
        actual = t.fn()
        pass = deepEqual(actual, t.expected)
      } catch (e) {
        actual = `Error: ${e.message}`
        pass = false
      }
      return { name: t.name, actual, expected: t.expected, pass }
    })
  }))
  hasRun.value = true
}

const passCount = computed(() =>
  results.value.flatMap(s => s.tests).filter(t => t.pass).length
)
const totalCount = computed(() =>
  results.value.flatMap(s => s.tests).length
)
const allPass = computed(() =>
  hasRun.value && passCount.value === totalCount.value
)
</script>

<template>
  <div class="vitest-demo">
    <h3>🧪 Q07 — Vitest 單元測試基礎（解答）</h3>

    <!-- 解答摘要 -->
    <section class="demo-section">
      <h4>✅ 三個 Bug 的修正</h4>
      <pre v-pre class="code-block">// ── Bug 1 修正：formatPrice() — 加入型別檢查 ──
function formatPrice(price, currency = 'USD') {
  if (typeof price !== 'number') return 'Invalid'  // ← 新增這行
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)
}
// 修正前：formatPrice('abc') → '$NaN'（直接格式化 NaN）
// 修正後：formatPrice('abc') → 'Invalid'（提前回傳）

// ── Bug 2 修正：validateEmail() — 量詞 * 改為 + ──
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  //           ↑ 修正：* → +（要求 @ 前至少有一個非空白非@字元）
}
// 修正前：validateEmail('@example.com') → true（@ 前為空也通過）
// 修正後：validateEmail('@example.com') → false（正確拒絕）

// ── Bug 3 修正：clamp() — Math 嵌套順序 ──
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
  // 內層 Math.max(value, min)：確保結果不低於 min（下界）
  // 外層 Math.min(..., max)：確保結果不超過 max（上界）
}
// 修正前：Math.max(Math.min(value, min), max) → 邏輯完全相反
// 修正後：clamp(-5, 0, 10) → 0（正確）</pre>
    </section>

    <!-- 測試執行區 -->
    <section class="demo-section">
      <div class="run-header">
        <h4>測試執行器（修正後應全數通過）</h4>
        <button class="btn" @click="runTests">▶ 執行測試</button>
        <span v-if="hasRun" class="summary" :class="{ 'all-pass': allPass }">
          {{ passCount }}/{{ totalCount }}&nbsp;{{ allPass ? '✅ 全部通過！' : '❌ 有測試失敗' }}
        </span>
      </div>

      <div v-if="hasRun" class="suites">
        <div v-for="suite in results" :key="suite.describe" class="suite">
          <div class="suite-name">📁 {{ suite.describe }}</div>
          <div
            v-for="test in suite.tests"
            :key="test.name"
            class="test-row"
            :class="test.pass ? 'pass' : 'fail'"
          >
            <span class="test-icon">{{ test.pass ? '✅' : '❌' }}</span>
            <span class="test-name">{{ test.name }}</span>
            <span v-if="!test.pass" class="test-detail">
              實際：<code>{{ JSON.stringify(test.actual) }}</code>
              &nbsp;預期：<code>{{ JSON.stringify(test.expected) }}</code>
            </span>
          </div>
        </div>
      </div>
      <p v-else class="hint">點擊按鈕（解答版應顯示 13/13 全部通過）</p>
    </section>

    <!-- Vitest 進階語法 -->
    <section class="demo-section">
      <h4>Vitest 進階語法</h4>
      <pre v-pre class="code-block">// ── it.each：資料驅動測試（避免重複 it）──
describe('clamp()', () => {
  it.each([
    [5, 0, 10, 5],    // [value, min, max, expected]
    [-5, 0, 10, 0],
    [15, 0, 10, 10],
  ])('clamp(%i, %i, %i) → %i', (value, min, max, expected) => {
    expect(clamp(value, min, max)).toBe(expected)
  })
})

// ── beforeEach：每個測試前執行清理 ──
describe('UserStore', () => {
  let store
  beforeEach(() => {
    store = createUserStore()   // 每次都用全新狀態
  })

  it('新增使用者', () => {
    store.addUser({ name: 'Alice' })
    expect(store.users).toHaveLength(1)
  })
})

// ── vi.fn()：Mock 函式（追蹤是否被呼叫）──
import { vi } from 'vitest'
const mockCallback = vi.fn()
doSomething(mockCallback)
expect(mockCallback).toHaveBeenCalledTimes(1)
expect(mockCallback).toHaveBeenCalledWith('expectedArg')</pre>
    </section>

    <!-- toBe vs toEqual 說明 -->
    <section class="demo-section">
      <h4>toBe vs toEqual 差異</h4>
      <pre v-pre class="code-block">// toBe — 使用 ===，比較參照（適合基本型別）
expect(1 + 1).toBe(2)           // ✅ 通過
expect('hello').toBe('hello')   // ✅ 通過
expect({}).toBe({})             // ❌ 失敗！兩個不同的物件參照

// toEqual — 深層比較內容（適合物件、陣列）
expect({ a: 1 }).toEqual({ a: 1 })         // ✅ 通過（內容相同）
expect([1, 2, 3]).toEqual([1, 2, 3])       // ✅ 通過（內容相同）
expect({ a: 1 }).toEqual({ a: 1, b: 2 }) // ❌ 失敗（屬性數量不同）

// 其他常用斷言
expect(arr).toHaveLength(3)     // 陣列長度
expect(str).toContain('hello')  // 包含子字串
expect(fn).toThrow()            // 函式應拋出錯誤
expect(val).toBeNull()          // 嚴格為 null
expect(val).toBeUndefined()     // 嚴格為 undefined
expect(val).toBeTruthy()        // truthy（非 false/0/null/undefined/''）</pre>
    </section>
  </div>
</template>

<style scoped>
.vitest-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
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

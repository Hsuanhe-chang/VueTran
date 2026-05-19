<script setup lang="ts">
/** _HeavyDashboard.vue — 模擬載入耗時的重型元件（已提供，不需修改）
 *  使用 Suspense 友好的 async setup() 模擬 1.2 秒的載入延遲
 */

// 定義儀表板統計資料的型別
interface DashboardStats {
  users:   number
  orders:  number
  revenue: string
  growth:  string
}

// 模擬向後端拉取儀表板資料（1.2 秒延遲）
// 帶入泛型參數 DashboardStats，避免 stats 被推斷為 unknown
const stats = await new Promise<DashboardStats>((resolve) =>
  setTimeout(() => resolve({
    users:    1284,
    orders:   382,
    revenue:  '$ 48,920',
    growth:   '+12.5%',
  }), 1200)
)
</script>

<template>
  <div class="heavy-dashboard">
    <h4>📊 數據儀表板（已載入）</h4>
    <p class="load-note">此元件模擬 1.2 秒的載入時間（defineAsyncComponent + Suspense 的效果）</p>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-icon">👥</span>
        <span class="stat-value">{{ stats.users }}</span>
        <span class="stat-label">總用戶數</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">📦</span>
        <span class="stat-value">{{ stats.orders }}</span>
        <span class="stat-label">今日訂單</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">💰</span>
        <span class="stat-value">{{ stats.revenue }}</span>
        <span class="stat-label">本月營收</span>
      </div>
      <div class="stat-card highlight">
        <span class="stat-icon">📈</span>
        <span class="stat-value">{{ stats.growth }}</span>
        <span class="stat-label">月成長率</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heavy-dashboard { padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-md); }
h4 { color: var(--color-secondary); }
.load-note { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-sm); }
.stat-card { background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-md); display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-card.highlight { border-color: var(--color-primary); background: rgba(66,184,131,0.05); }
.stat-icon { font-size: 1.5rem; }
.stat-value { font-size: var(--font-size-xl, 1.5rem); font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.stat-label { font-size: var(--font-size-sm); color: var(--color-text-muted); }
</style>

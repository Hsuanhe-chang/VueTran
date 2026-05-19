<script setup lang="ts">
/** Q06 — 程式化導航（useRouter）（填空）
 *
 *  useRouter() 讓你在 JavaScript 中執行導航（而不是 template 的 <RouterLink>）：
 *
 *  router.push(to)    — 新增歷史紀錄，可「後退」回來
 *  router.replace(to) — 取代當前歷史，無法後退
 *  router.go(n)       — 在歷史紀錄中前進 / 後退 n 步
 *  router.back()      — 後退一步（等同 router.go(-1)）
 *  router.forward()   — 前進一步（等同 router.go(1)）
 */
import { ref } from 'vue'
import { useRoute /* TODO：也需要 useRouter */ } from 'vue-router'

// ── 導航日誌每筆紀錄的形狀 ──────────────────────────────────
interface LogEntry {
  msg: string   // 導航動作說明文字
  time: string  // 執行時間（格式化字串）
}

// TODO：取得 router 實例
// const router = useRouter()

// 讀取當前路由（顯示用）
const route = useRoute()

// 記錄導航動作日誌
const navLog = ref<LogEntry[]>([])  // 明確指定元素型別，避免 TS 推斷為 never[]
function log(msg: string): void {
  navLog.value.unshift({ msg, time: new Date().toLocaleTimeString() })
}
</script>

<template>
  <div class="prog-nav-demo">
    <h3>🧭 Q06 — 程式化導航（useRouter）（填空）</h3>

    <!-- ── 目前路由 ── -->
    <section class="demo-section">
      <h4>當前路由資訊</h4>
      <div class="route-info">
        <div class="info-row"><span class="info-label">route.path</span><span class="info-value">{{ route.path }}</span></div>
        <div class="info-row"><span class="info-label">route.name</span><span class="info-value">{{ route.name }}</span></div>
        <div class="info-row"><span class="info-label">route.query</span><span class="info-value">{{ JSON.stringify(route.query) }}</span></div>
      </div>
    </section>

    <!-- ── 填空操作區 ── -->
    <section class="demo-section">
      <h4>填空：各種 router 方法</h4>

      <div class="nav-buttons">

        <!-- A. push 路徑字串 -->
        <div class="nav-group">
          <p class="nav-label">A. router.push(string) — 導航到首頁</p>
          <pre v-pre class="code-inline">router.push('/')</pre>
          <button class="btn btn-primary" @click="
            /* TODO A: router.push('/') */
            log('A: router.push(\'/\') — 尚未實作')
          ">
            前往首頁
          </button>
        </div>

        <!-- B. push 物件（含 name + params + query） -->
        <div class="nav-group">
          <p class="nav-label">B. router.push({ name, params, query }) — 導航到特定題目</p>
          <pre v-pre class="code-inline">router.push({ name: 'exercise', params: { stageId: '04', questionId: 'q01' }, query: { tab: 'answer' } })</pre>
          <button class="btn btn-outline" @click="
            /* TODO B: router.push({ name: 'exercise', params: { stageId: '04', questionId: 'q01' }, query: { tab: 'answer' } }) */
            log('B: router.push({...}) — 尚未實作')
          ">
            用物件導航到 Q01
          </button>
        </div>

        <!-- C. replace -->
        <div class="nav-group">
          <p class="nav-label">C. router.replace — 不留歷史，無法後退</p>
          <pre v-pre class="code-inline">router.replace({ name: 'home' })</pre>
          <button class="btn btn-outline" @click="
            /* TODO C: router.replace({ name: 'home' }) */
            log('C: router.replace({...}) — 尚未實作')
          ">
            Replace 到首頁（無歷史）
          </button>
        </div>

        <!-- D. go / back -->
        <div class="nav-group">
          <p class="nav-label">D. router.go / router.back — 瀏覽器歷史</p>
          <pre v-pre class="code-inline">router.go(-1)  // 或 router.back()</pre>
          <div class="btn-row">
            <button class="btn btn-outline" @click="
              /* TODO D1: router.go(-1) */
              log('D1: router.go(-1) — 尚未實作')
            ">← 後退</button>
            <button class="btn btn-outline" @click="
              /* TODO D2: router.go(1) */
              log('D2: router.go(1) — 尚未實作')
            ">前進 →</button>
          </div>
        </div>

      </div>
    </section>

    <!-- ── 日誌 ── -->
    <section class="demo-section">
      <h4>導航日誌</h4>
      <div v-if="navLog.length === 0" class="empty-log"><p>點擊上方按鈕後，這裡會顯示操作記錄</p></div>
      <div v-else class="log-list">
        <div v-for="(entry, i) in navLog" :key="i" class="log-entry">
          <span class="log-time">{{ entry.time }}</span>
          <span class="log-msg">{{ entry.msg }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.prog-nav-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.route-info { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: var(--space-sm); font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 120px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); word-break: break-all; }
.nav-buttons { display: flex; flex-direction: column; gap: var(--space-md); }
.nav-group { display: flex; flex-direction: column; gap: 6px; padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.nav-label { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-secondary); margin: 0; }
.code-inline { background: #1e293b; color: #e2e8f0; padding: 6px 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.8rem; white-space: pre-wrap; margin: 0; }
.btn { padding: 8px 18px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 500; align-self: flex-start; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-row { display: flex; gap: var(--space-sm); }
.empty-log { padding: var(--space-md); text-align: center; color: var(--color-text-muted); border: 1px dashed var(--color-border); border-radius: var(--radius-md); }
.log-list { display: flex; flex-direction: column; gap: 4px; max-height: 180px; overflow-y: auto; }
.log-entry { display: flex; gap: var(--space-sm); font-size: var(--font-size-sm); padding: 4px var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); }
.log-time { font-family: var(--font-mono); color: var(--color-text-muted); font-size: 0.7rem; white-space: nowrap; }
.log-msg { color: var(--color-text); }
</style>

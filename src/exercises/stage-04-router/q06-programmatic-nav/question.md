# Q06 — 程式化導航（useRouter）

## 對應官方文件
- 章節：Programmatic Navigation
- URL：https://router.vuejs.org/guide/essentials/navigation

## 題型
填空

## 難度
⭐ 基礎

## 題目說明
除了用 `<RouterLink>` 在 template 中做宣告式導航，
Vue Router 也提供 `useRouter()` 讓你在 JavaScript 中「程式化」導航。

常見使用場景：
- 表單送出後導航到成功頁
- 身分驗證後自動導向（`router.push` 帶 `redirect` query）
- 瀏覽器的前進 / 後退（`router.go`）

## 起手式說明
`Starter.vue` 中已有：
- 各種導航方法的示範按鈕（UI 已完成）
- `/* TODO */` 標記的空白處，需要你填入正確的 `router` 方法呼叫

請你填入：
1. `router.push('/home')` — 基本路徑導航
2. `router.push({ name: 'exercise', params: {...}, query: {...} })` — 物件導航
3. `router.replace(...)` — 不留歷史紀錄的導航
4. `router.go(-1)` — 後退一步

## 驗收標準
- [ ] `push` 能導航並在瀏覽器歷史紀錄中新增一筆
- [ ] `replace` 能導航但不增加歷史紀錄（無法按「上一頁」回去）
- [ ] `go(-1)` 等同瀏覽器「上一頁」按鈕
- [ ] 能用 `{ name, params, query }` 物件形式取代路徑字串

## 提示
- `const router = useRouter()` — 取得 router 實例（只能在 `<script setup>` 或 setup 函式內呼叫）
- `router.push(path)` — 導航到指定路徑，新增歷史紀錄
- `router.replace(path)` — 導航但取代當前歷史紀錄（不可後退）
- `router.go(n)` — 前進 n 步（負數後退）
- `router.back()` — 等同 `router.go(-1)`

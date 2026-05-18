# Q04 — Composable 與 Lifecycle 整合（useEventListener / useWindowSize）

## 對應官方文件
- 章節：Composables — Lifecycle Hooks Inside Composables
- URL：https://vuejs.org/guide/reusability/composables#lifecycle-hooks

## 題型
填空

## 難度
⭐⭐ 中級

## 題目說明
實作兩個常見的 Composable，練習在 Composable 內部整合 Lifecycle Hooks：

1. `useEventListener(target, event, callback)`
   - 在 `onMounted` 時綁定事件監聽器
   - 在 `onUnmounted` 時移除監聽器（避免記憶體洩漏）

2. `useWindowSize()`
   - 呼叫 `useEventListener` 監聽 `resize` 事件
   - 回傳 `{ width, height }` 兩個響應式 ref

## 起手式說明
`Starter.vue` 中已有：
- UI 顯示 width / height 的 template
- `useEventListener` 和 `useWindowSize` 的骨架（含 `/* TODO */` 填空處）

請你填入：
1. `useEventListener`：`onMounted` 呼叫 `addEventListener`、`onUnmounted` 呼叫 `removeEventListener`
2. `useWindowSize`：呼叫 `useEventListener` 監聽 `resize`，並在回調中更新 `width.value` 和 `height.value`

## 驗收標準
- [ ] 頁面載入後顯示當前視窗寬高
- [ ] 拖曳改變瀏覽器視窗大小時，數值即時更新
- [ ] 元件卸載後不會出現 `addEventListener` 未移除的警告

## 提示
- `onMounted(() => target.addEventListener(event, callback))`
- `onUnmounted(() => target.removeEventListener(event, callback))`
- `window.innerWidth` / `window.innerHeight` — 取得當前視窗尺寸

# Q06 — shallowRef / shallowReactive 效能優化

## 對應官方文件
- 章節：shallowRef / shallowReactive
- URL：https://vuejs.org/api/reactivity-advanced

## 題型
找錯誤 + 重構

## 難度
⭐⭐⭐ 進階

## 題目說明
Vue 的 `ref()` 和 `reactive()` 預設是**深層（deep）響應式**，會遞迴追蹤所有巢狀屬性。
對於大型物件或頻繁替換整個值的場景，這會造成不必要的效能開銷。

| API | 追蹤深度 | 適用場景 |
|---|---|---|
| `ref()` | 深層（遞迴） | 小型物件、基本型別 |
| `shallowRef()` | 僅 `.value` 本身 | 大型物件、整個替換 |
| `reactive()` | 深層（遞迴） | 小型狀態物件 |
| `shallowReactive()` | 僅頂層屬性 | 大型結構化物件 |

**shallowRef 的陷阱：**
```js
const state = shallowRef({ count: 0 })

// ❌ 直接改巢狀屬性 → 不觸發更新
state.value.count++

// ✅ 替換整個 .value → 觸發更新
state.value = { count: state.value.count + 1 }

// ✅ 或使用 triggerRef 強制更新
state.value.count++
triggerRef(state)
```

## 起手式說明
`Starter.vue` 有 **3 個 Bug**：
1. Bug A：對小型基本型別用 `shallowRef`（沒問題但多餘），需辨別正確使用時機
2. Bug B：直接修改 `shallowRef` 的巢狀屬性而沒有 `triggerRef`
3. Bug C：應該用 `shallowRef` 的大型列表卻用了 `ref`（效能問題）

請找出並修正所有 bug，並重構 Bug C 的效能問題。

## 驗收標準
- [ ] Bug B 修正後：點擊按鈕能正確觸發視圖更新
- [ ] Bug C 重構後：改用 shallowRef + 整個替換策略
- [ ] 理解 triggerRef 的使用時機

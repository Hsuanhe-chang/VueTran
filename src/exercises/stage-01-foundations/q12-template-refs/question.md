# Q12 — Template Refs（useTemplateRef）

## 對應官方文件
- 章節：Template Refs
- URL：https://vuejs.org/guide/essentials/template-refs

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 核心知識

`useTemplateRef()` 是 Vue 3.5+ 的新 API，用來取得對 DOM 元素或子元件的直接參照。

```js
import { useTemplateRef, onMounted } from 'vue'

// 在 script 中宣告
const inputEl = useTemplateRef('myInput')

// 在 template 中用 ref="myInput" 連結
// <input ref="myInput" />

// 只有在 onMounted 後才能使用（因為 DOM 必須先掛載）
onMounted(() => {
  inputEl.value?.focus()  // 自動聚焦
})
```

> 舊版用 `const inputEl = ref(null)` + `ref="inputEl"` 也能達到同樣效果，但 `useTemplateRef` 更明確。

## 任務

建立一個「自動聚焦搜尋框」元件：
1. 頁面掛載後，搜尋框自動聚焦（`onMounted` + `focus()`）
2. 點擊「清除」按鈕時，清空輸入並重新聚焦
3. 顯示搜尋框的當前寬度（透過 `inputEl.value.offsetWidth` 讀取 DOM 屬性）

## 驗收標準
- [ ] 頁面載入後搜尋框自動聚焦
- [ ] 清除按鈕清空並重新聚焦
- [ ] 正確顯示輸入框寬度（真實 DOM 屬性）
- [ ] `useTemplateRef` 使用正確（template 中的 ref 字串與 API 呼叫一致）

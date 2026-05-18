# Q03 — 表單驗證（原生 Vue 響應式驗證）

## 對應官方文件
- 章節：Form Input Bindings
- URL：https://vuejs.org/guide/essentials/forms

## 題型
功能實作

## 難度
⭐⭐ 中級

## 題目說明
在 Vue 3 中使用原生響應式 API 實作表單驗證，是進入 VeeValidate 等第三方庫前的必修基礎。

核心概念：
1. **Touch 追蹤**：只在使用者「碰過」欄位後才顯示錯誤（不在初始就亮紅燈）
2. **Computed 計算錯誤**：根據 `form` 與 `touched` 動態計算每個欄位的錯誤訊息
3. **Submit 驗證**：提交時強制 touch 所有欄位，若有錯誤則阻止送出

```js
const form = reactive({ name: '', email: '', role: 'viewer' })
const touched = reactive({ name: false, email: false })

const errors = computed(() => {
  const e = {}
  if (touched.name && !form.name.trim())
    e.name = '姓名為必填'
  if (touched.email && !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
    e.email = '請輸入有效的 Email 格式'
  return e
})
```

## 起手式說明
`Starter.vue` 已有表單 HTML 結構（fields + submit button）。
**需要你從零撰寫：**
1. `form` reactive 物件
2. `touched` reactive 物件（欄位 blur 時設為 true）
3. `errors` computed（根據 touched + form 計算錯誤）
4. `handleSubmit()` 函式（強制 touch 全部，驗證通過才顯示成功）

## 驗收標準
- [ ] 初始進入：各欄位無錯誤訊息
- [ ] 點擊後離開（blur）：若為空白，顯示錯誤
- [ ] Email 格式錯誤：顯示對應訊息
- [ ] 點擊送出：未填欄位全部顯示錯誤，阻止送出
- [ ] 全部驗證通過：顯示成功訊息

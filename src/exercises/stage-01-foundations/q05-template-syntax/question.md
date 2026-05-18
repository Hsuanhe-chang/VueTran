# Q05 — Template 語法：插值與指令

## 對應官方文件
- 章節：Template Syntax
- URL：https://vuejs.org/guide/essentials/template-syntax

## 題型
填空

## 難度
⭐ 基礎

## 任務

填完 Starter.vue 中所有 `/* TODO */` 的空白，讓以下功能正確運作：

1. **文字插值**：用 `{{ }}` 顯示變數
2. **v-bind 屬性綁定**：動態綁定 HTML 屬性（用 `:` 縮寫）
3. **v-html**：渲染 HTML 字串（注意 XSS 風險）
4. **一次性渲染 v-once**：避免重新渲染的靜態內容
5. **JavaScript 表達式**：在 `{{ }}` 中使用簡單運算

## 驗收標準
- [ ] 所有文字插值正確顯示
- [ ] 圖片的 src / alt 屬性正確動態綁定
- [ ] HTML 內容用 v-html 渲染（可看到顏色效果）
- [ ] v-once 的內容在資料改變後不更新
- [ ] `{{ }}` 中的 JS 表達式正確執行

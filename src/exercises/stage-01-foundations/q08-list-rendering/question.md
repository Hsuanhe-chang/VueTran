# Q08 — v-for 列表渲染（含 key）

## 對應官方文件
- 章節：List Rendering
- URL：https://vuejs.org/guide/essentials/list

## 題型
填空 + 找錯誤

## 難度
⭐ 基礎

## 核心知識

- `v-for="item in list"` — 渲染陣列
- `v-for="(item, index) in list"` — 含 index
- `v-for="(value, key) in object"` — 遍歷物件
- **`:key` 是必須的**：幫助 Vue 辨識每個項目，避免渲染錯誤
- key 應使用**唯一且穩定**的值（如 id），避免用 index（尤其在有刪除/排序操作時）

## 任務

**Part A（填空）**：完成學生名單的 v-for 渲染

**Part B（找錯誤）**：找出 2 個 v-for 常見的 key 使用錯誤

## 驗收標準
- [ ] Part A：學生名單正確渲染
- [ ] Part A：每個 li 都有正確的 :key 綁定（使用 id）
- [ ] Part B：找出並說明 2 個 bug
- [ ] 能說明為什麼 key 應使用 id 而非 index

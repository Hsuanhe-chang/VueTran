# Q10 — v-model 表單雙向綁定

## 對應官方文件
- 章節：Form Input Bindings
- URL：https://vuejs.org/guide/essentials/forms

## 題型
從零撰寫

## 難度
⭐ 基礎

## 核心知識

`v-model` 是 `:value` + `@input` 的語法糖，讓資料與輸入框雙向同步。

不同表單元素的 v-model 行為：
- `<input type="text">` → 綁定字串
- `<input type="number">` → 搭配 `.number` 修飾符
- `<input type="checkbox">` → 綁定 boolean（單一）或陣列（多選）
- `<input type="radio">` → 綁定字串（當前選中值）
- `<select>` → 綁定字串（單選）或陣列（多選）
- `<textarea>` → 綁定字串

## 任務

建立一個**個人設定表單**，包含：
1. 文字輸入（name）
2. 數字輸入（age，用 `.number` 修飾符確保類型為 number）
3. 單一 checkbox（同意條款）
4. 多選 checkbox（興趣標籤）
5. radio（性別選擇）
6. select（所在縣市）
7. textarea（自我介紹）
8. 即時顯示所有表單值（展示雙向綁定效果）

## 驗收標準
- [ ] 所有表單欄位正確雙向綁定
- [ ] `age` 的類型是 number（非字串）
- [ ] 多選 checkbox 回傳陣列
- [ ] 即時顯示區正確反映所有欄位的當前值

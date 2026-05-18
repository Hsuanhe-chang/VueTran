# Q06 — Class 與 Style 動態綁定

## 對應官方文件
- 章節：Class and Style Bindings
- URL：https://vuejs.org/guide/essentials/class-and-style

## 題型
從零撰寫

## 難度
⭐ 基礎

## 任務

建立一個**主題切換卡片**元件：

1. 用 `:class` 物件語法動態切換 CSS class（如 `active`、`highlighted`）
2. 用 `:style` 動態設定內聯樣式（自訂顏色、字型大小）
3. 提供開關按鈕控制 active / highlighted 狀態
4. 提供 range input 控制字型大小

## 驗收標準
- [ ] `:class` 物件語法正確（`{ 'class-name': booleanRef }`）
- [ ] `:style` 物件語法正確（`{ property: value }`）
- [ ] 開關按鈕能切換 class 的套用與否
- [ ] range input 能即時改變字型大小

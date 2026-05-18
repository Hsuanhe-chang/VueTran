# Q07 — Vitest 單元測試基礎

## 對應官方文件
- 章節：Testing
- URL：https://vitest.dev/guide/

## 題型
找錯誤並修正

## 難度
⭐⭐ 中級

## 題目說明
單元測試讓你在不啟動整個應用的情況下驗證純函式的行為。
Vitest 是 Vite 原生的測試框架，語法與 Jest 高度相容。

此題使用「模擬測試執行器」在瀏覽器中展示測試邏輯（Vitest 需額外安裝）。

| Vitest API | 說明 |
|---|---|
| `describe()` | 測試群組，對應一個模組或類別 |
| `it()` / `test()` | 單一測試案例 |
| `expect(actual)` | 建立斷言 |
| `.toBe(expected)` | 嚴格相等（===），適合基本型別 |
| `.toEqual(expected)` | 深層相等，適合物件/陣列 |
| `.toBeTruthy()` | 值為 truthy |

```js
// 典型 Vitest 測試範例
import { describe, it, expect } from 'vitest'
import { formatPrice } from './utils'

describe('formatPrice()', () => {
  it('正數金額格式化', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })
  it('非數字回傳 Invalid', () => {
    expect(formatPrice('abc')).toBe('Invalid')
  })
})
```

## 起手式說明
`Starter.vue` 有三個工具函式，每個各含一個 Bug，導致部分測試失敗。
模擬測試執行器已定義好所有 13 個測試案例與正確預期值。

**需要你找出並修正：**
1. `formatPrice()` — 為何「非數字回傳 Invalid」測試失敗？
2. `validateEmail()` — 為何「@ 前無帳號名」測試失敗？
3. `clamp()` — 為何多個 clamp 測試失敗？

## 驗收標準
- [ ] 修正 `formatPrice()`，非數字輸入正確回傳 `'Invalid'`
- [ ] 修正 `validateEmail()`，`'@example.com'` 正確回傳 `false`
- [ ] 修正 `clamp()`，所有邊界情況正確限制
- [ ] 點擊「執行測試」後顯示 13/13 ✅ 全部通過
- [ ] 能說明 `toBe` 與 `toEqual` 的差異

## 提示
- `typeof price !== 'number'` 可以用來檢查型別
- 正則表達式中 `+` 要求「一個或多個」，`*` 要求「零個或多個」
- 正確的 clamp 實作：`Math.min(Math.max(value, min), max)`

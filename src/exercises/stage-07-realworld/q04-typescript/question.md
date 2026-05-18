# Q04 — TypeScript 與 Vue 3 整合（JSDoc 型別 + defineProps 驗證）

## 對應官方文件
- 章節：TypeScript with Vue
- URL：https://vuejs.org/guide/typescript/overview

## 題型
重構

## 難度
⭐⭐⭐ 進階

## 題目說明
本專案使用 JavaScript，但型別安全在大型專案中至關重要。
在尚未引入 TypeScript 時，可用以下方式增加型別保障：

| 方法 | 工具 | 說明 |
|------|------|------|
| JSDoc 型別標註 | `/** @type {} */` | IDE 型別提示、VSCode IntelliSense |
| defineProps validators | `validator: (val) => ...` | 執行期型別檢查（dev mode 警告）|
| PropTypes 規格文件 | 在元件頂部說明 | 協作溝通用 |

TypeScript 版本的 Props 型別：
```ts
// lang="ts" 版本（本題展示對照）
interface User {
  id: number
  name: string
  role: 'admin' | 'editor' | 'viewer'
}
const props = defineProps<{ user: User; readonly?: boolean }>()
```

## 起手式說明
`Starter.vue` 是一個「使用者卡片」元件，目前完全沒有型別標註。
**需要你重構：**
1. 在檔案頂部加入 JSDoc `@typedef` 定義 User 型別
2. 為 `defineProps` 加入 `type`、`required`、`validator` 驗證
3. 為主要函式加入 JSDoc `@param` / `@returns` 標註

## 驗收標準
- [ ] defineProps 有 type + required 設定
- [ ] role 欄位有 validator 驗證合法值
- [ ] 至少一個函式有 JSDoc 標註
- [ ] 元件功能維持不變（重構不改行為）

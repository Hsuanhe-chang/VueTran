# Q07 — Pinia Plugin 開發

## 對應官方文件
- 章節：Plugins
- URL：https://pinia.vuejs.org/core-concepts/plugins

## 題型
填空

## 難度
⭐⭐⭐ 進階

## 題目說明
Pinia Plugin 可以為**所有 Store** 統一新增屬性、方法或行為，
在 `main.js` 中透過 `pinia.use(plugin)` 安裝：

```js
// main.js
const pinia = createPinia()

// Plugin：為每個 Store 新增 $reset() 方法
pinia.use(({ store }) => {
  const initialState = structuredClone(toRaw(store.$state))
  store.$reset = () => store.$patch(structuredClone(initialState))
})

app.use(pinia)
```

Plugin 函式接收 `context` 物件，其中包含：
| 屬性 | 說明 |
|---|---|
| `store` | 當前 Store 實例（可新增屬性） |
| `pinia` | Pinia 實例 |
| `app` | Vue app 實例（僅 Vue 3） |
| `options` | defineStore 傳入的選項 |

本題展示**三種常見 Plugin 模式**的程式碼填空練習：
1. 持久化 Plugin（`localStorage`）
2. 日誌 Plugin（`$onAction`）
3. 全域重置 Plugin（`$reset`）

## 起手式說明
`Starter.vue` 中已有完整的 UI，以及三個 Plugin 的骨架，
請補完 `/* TODO */` 空白，讓所有 Plugin 概念可以在互動 Demo 中運作。

## 驗收標準
- [ ] 理解 Plugin 函式接收的 context 參數
- [ ] 持久化 Plugin 能讀寫 localStorage
- [ ] 日誌 Plugin 能在 action 執行前後記錄
- [ ] 重置 Plugin 能將 store 還原到初始狀態

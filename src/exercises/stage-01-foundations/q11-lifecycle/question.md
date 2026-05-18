# Q11 — Lifecycle Hooks 生命週期鉤子

## 對應官方文件
- 章節：Lifecycle Hooks
- URL：https://vuejs.org/guide/essentials/lifecycle

## 題型
填空

## 難度
⭐⭐ 中級

## 生命週期順序

```
setup() → onBeforeMount → onMounted → [資料更新] → onBeforeUpdate → onUpdated → [元件卸載] → onBeforeUnmount → onUnmounted
```

| Hook | 時機 | 常見用途 |
|---|---|---|
| `onBeforeMount` | DOM 插入前 | 很少使用 |
| `onMounted` | DOM 插入後 | 啟動 API 請求、初始化第三方庫 |
| `onBeforeUpdate` | 資料變動，DOM 更新前 | 存取更新前的 DOM |
| `onUpdated` | DOM 更新後 | 操作更新後的 DOM |
| `onBeforeUnmount` | 元件移除前 | 清除 timer、移除事件監聽 |
| `onUnmounted` | 元件移除後 | 最後的清理工作 |

## 任務

在 Starter.vue 中填入正確的 lifecycle hook，完成一個「資料載入模擬器」：
1. `onMounted`：模擬 API 請求（setTimeout 1.5 秒後設定資料）
2. `onBeforeUnmount`：清除計時器，避免記憶體洩漏
3. `onUpdated`：每次資料更新後記錄 log

## 驗收標準
- [ ] `onMounted` 中正確啟動模擬 API 請求
- [ ] 1.5 秒後資料顯示（isLoading 從 true 改為 false）
- [ ] `onBeforeUnmount` 清除計時器
- [ ] `onUpdated` 在資料更新後觸發

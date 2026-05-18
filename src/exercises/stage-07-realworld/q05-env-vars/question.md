# Q05 — 環境變數管理（import.meta.env）

## 對應官方文件
- 章節：Env Variables & Modes
- URL：https://vite.dev/guide/env-and-mode

## 題型
填空

## 難度
⭐ 基礎

## 題目說明
Vite 透過 `import.meta.env` 暴露環境變數，分為兩類：

| 類型 | 說明 | 範例 |
|------|------|------|
| 內建變數 | Vite 自動提供 | `MODE`, `BASE_URL`, `PROD`, `DEV` |
| 自訂變數 | 需以 `VITE_` 為前綴 | `VITE_API_URL`, `VITE_APP_NAME` |

```
# .env（所有模式共用）
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyApp

# .env.production（生產環境）
VITE_API_URL=https://api.prod.example.com

# .env.development（開發環境）
VITE_API_URL=http://localhost:3000
```

**重要限制：**
- 瀏覽器端只能讀取 `VITE_` 前綴的變數（避免洩漏敏感資訊）
- 沒有 `VITE_` 前綴的變數（如 `DB_PASSWORD`）不會暴露給客戶端

## 起手式說明
`Starter.vue` 有 5 個 TODO 填空，對應正確的 `import.meta.env` 屬性名稱。

## 驗收標準
- [ ] 正確讀取 MODE / BASE_URL / PROD / DEV 內建變數
- [ ] 了解 VITE_ 前綴規則
- [ ] 能解釋各模式（development / production / test）的用途

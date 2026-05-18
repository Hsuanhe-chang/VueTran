# Q99 — 綜合題：含權限控制的多頁面路由系統

## 對應官方文件
- 章節：Navigation Guards + Route Meta Fields + Programmatic Navigation
- URL：https://router.vuejs.org/guide/advanced/navigation-guards

## 題型
功能實作

## 難度
⭐⭐⭐ 進階

## 題目說明
綜合運用 Stage 4 的所有 Vue Router 概念，
實作一個具有**登入驗證 + 角色權限**的模擬多頁面系統：

系統包含 5 個「頁面」：
- `首頁`（Home）— 公開
- `文章列表`（Posts）— 需登入，可帶搜尋 query params
- `文章詳情`（Post :id）— 需登入，使用動態 params
- `個人資料`（Profile）— 需登入
- `後台管理`（Admin）— 需登入，且只有 admin 角色

系統行為：
- 切換「頁面」時執行模擬守衛（checkAuth）
- 未登入訪問受保護頁面 → 顯示 Login 畫面，可登入後繼續
- 已登入但無權限 → 顯示 403
- 各頁面顯示對應的 meta 資訊（title、breadcrumb）
- Posts 頁面有搜尋功能（同步到模擬 query params）

## 起手式說明
`Starter.vue` 中已有：
- 完整的 UI 結構（頁面按鈕、內容顯示區）
- mock auth 狀態和 mockRoutes 定義
- TODO：實作 checkAuth 和各頁面功能

## 驗收標準
- [ ] 守衛正確攔截需要認證的頁面
- [ ] 登入後可自動回到原本要訪問的頁面（redirect 功能）
- [ ] Post 詳情頁根據 :id 顯示對應文章
- [ ] Posts 搜尋框過濾文章列表
- [ ] 頁面切換時麵包屑和 title 正確更新

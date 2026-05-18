# Q07 — v-if / v-show 條件渲染

## 對應官方文件
- 章節：Conditional Rendering
- URL：https://vuejs.org/guide/essentials/conditional

## 題型
找錯誤

## 難度
⭐ 基礎

## 核心差異

| | `v-if` | `v-show` |
|---|---|---|
| 假值時 | **DOM 移除**（不渲染） | **CSS display: none**（渲染但隱藏） |
| 切換成本 | 高（重新建立 DOM） | 低（只改 CSS） |
| 初始成本 | 低（不需渲染） | 高（一開始就渲染） |
| 適合場景 | 條件很少改變 | 頻繁切換顯示/隱藏 |

## 任務

Starter.vue 中有 **3 個條件渲染相關的 bug**，找出並說明原因，然後修正它們。

## 驗收標準
- [ ] 找出全部 3 個 bug 並說明原因
- [ ] 修正後程式可正確執行
- [ ] 能說明 v-if 與 v-show 的適用場景

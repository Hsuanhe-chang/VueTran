# Q03 — TransitionGroup 列表動畫

## 對應官方文件
- 章節：TransitionGroup
- URL：https://vuejs.org/guide/built-ins/transition-group

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
`<TransitionGroup>` 為 **v-for 列表**的新增、移除、排序提供動畫。

與 `<Transition>` 的主要差異：

| | Transition | TransitionGroup |
|---|---|---|
| 適用對象 | 單一元素 | v-for 列表 |
| 需要 key | 非必要 | **必須有 key** |
| 預設渲染 | 不渲染容器 | 需指定 `tag` 或不渲染 |
| 排序動畫 | 無 | `.v-move` 或 `.name-move` |

特別注意：`TransitionGroup` 的**移動動畫**（重排）需要添加 `{name}-move` CSS 類別，
搭配 `position: absolute`（在 leave-active 時）讓其他元素能順利移動。

## 起手式說明
`Starter.vue` 已有清單 UI 和 v-for，**需要你從零撰寫：**
1. 把 `<ul>` 換成 `<TransitionGroup tag="ul">`
2. 撰寫進入（list-enter）動畫 CSS
3. 撰寫離開（list-leave）動畫 CSS
4. 撰寫移動（list-move）動畫 CSS

## 驗收標準
- [ ] 新增項目時有滑入動畫
- [ ] 移除項目時有滑出/淡出動畫
- [ ] 移除後其他項目平滑移動填補空位（list-move）
- [ ] 打亂排序時有流暢的位移動畫

# Q02 — Transition 進入/離開動畫

## 對應官方文件
- 章節：Transition
- URL：https://vuejs.org/guide/built-ins/transition

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
`<Transition>` 為**單一元素/元件**的進入與離開提供動畫效果。

CSS 類別命名規則（以 `name="fade"` 為例）：

| 階段 | 進入 | 離開 |
|---|---|---|
| 起始狀態 | `.fade-enter-from` | `.fade-leave-from` |
| 進行中 | `.fade-enter-active` | `.fade-leave-active` |
| 結束狀態 | `.fade-enter-to` | `.fade-leave-to` |

常用技巧：
- `enter-active` / `leave-active` 加 `transition: all 0.3s ease` 定義時長
- `enter-from` / `leave-to` 定義初始/結束的「非可見」狀態
- `mode="out-in"` 先等舊元素離開再讓新元素進入

## 起手式說明
`Starter.vue` 中已有完整 UI 骨架和三個 Transition Demo：
1. **Fade**（漸隱漸現）— 需撰寫 CSS
2. **Slide Down**（從上滑入）— 需撰寫 CSS
3. **Scale**（縮放）— 需撰寫 CSS

請你撰寫 `<style scoped>` 中的所有 Transition CSS 類別。

## 驗收標準
- [ ] fade 動畫：opacity 0→1 進入，1→0 離開，時長 0.4s
- [ ] slide-down 動畫：從 -20px 滑入，透明度配合變化
- [ ] scale 動畫：scale(0.8)→scale(1) 縮放進入
- [ ] 切換時動畫流暢，無跳動

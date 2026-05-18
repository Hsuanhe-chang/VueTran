# Q09 — 事件處理與修飾符

## 對應官方文件
- 章節：Event Handling
- URL：https://vuejs.org/guide/essentials/event-handling

## 題型
從零撰寫

## 難度
⭐ 基礎

## 核心知識

- `@click` 是 `v-on:click` 的縮寫
- 事件修飾符：`.stop`（停止冒泡）、`.prevent`（阻止預設行為）、`.once`（只觸發一次）、`.self`（只在自身觸發）
- 按鍵修飾符：`@keyup.enter`、`@keyup.escape`
- 滑鼠修飾符：`@click.left`、`@click.right`、`@click.middle`

## 任務

建立一個**事件練習面板**：
1. 點擊按鈕時 console.log 事件物件（`$event` 或 `event` 參數）
2. 示範 `.stop` 修飾符（阻止子元素的點擊事件冒泡到父層）
3. 示範 `.prevent` 修飾符（阻止表單 submit 的預設行為）
4. 示範 `@keyup.enter` 按下 Enter 時觸發

## 驗收標準
- [ ] 正確使用 `@click` 縮寫
- [ ] `.stop` 阻止事件冒泡（點子元素時父層不觸發）
- [ ] `.prevent` 阻止表單提交刷新頁面
- [ ] `@keyup.enter` 在 Enter 鍵時觸發

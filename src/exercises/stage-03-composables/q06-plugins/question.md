# Q06 — Plugin 開發與安裝

## 對應官方文件
- 章節：Plugins
- URL：https://vuejs.org/guide/reusability/plugins

## 題型
填空

## 難度
⭐⭐ 中級

## 題目說明
Vue Plugin 是一種封裝全域功能的機制，讓你可以在整個應用程式中共享：
- 全域元件（`app.component()`）
- 全域指令（`app.directive()`）
- 全域屬性（`app.config.globalProperties`）
- Provide / Inject 值（`app.provide()`）

本題練習撰寫一個 `i18nPlugin`（國際化插件），讓元件可以透過 `inject('translate')` 取得翻譯函式。

## 起手式說明
`Starter.vue` 中已有：
- `messages` 翻譯對照表（中英文字典）
- `i18nPlugin` 物件骨架（含 `install(app, options)` 方法）
- 元件中使用 `inject('translate')` 的示範

請你在 `install(app, options)` 中：
1. 定義翻譯函式 `translate(key)` — 從 `options.messages[key]` 查找翻譯
2. 用 `app.provide('translate', translate)` 讓所有子元件可以 inject 取得
3. 用 `app.config.globalProperties.$t = translate` 讓 Options API 元件也可直接用 `$t(key)`

## 驗收標準
- [ ] 翻譯函式可正確將 key 對應到 messages 中的字串
- [ ] 找不到翻譯時，回傳 key 本身（不崩潰）
- [ ] 元件中 `inject('translate')` 可取得翻譯函式並正常呼叫

## 提示
- Plugin 的核心是 `install(app, options)` 方法（或直接是一個函式）
- `app.provide(key, value)` — 讓整棵元件樹都能 `inject(key)` 取得值
- `app.config.globalProperties.xxx = value` — 在 Options API 的 `this.xxx` 上掛載全域屬性
- `options.messages?.[key] ?? key` — 若找不到翻譯則退回 key 字串

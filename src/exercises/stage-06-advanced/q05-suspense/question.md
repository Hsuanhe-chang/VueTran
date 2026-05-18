# Q05 — Suspense 與非同步元件

## 對應官方文件
- 章節：Suspense
- URL：https://vuejs.org/guide/built-ins/suspense

## 題型
從零撰寫

## 難度
⭐⭐⭐ 進階

## 題目說明
`<Suspense>` 讓你在非同步元件**載入完成前**顯示一個 fallback UI（骨架屏/Loading）。

適用情境：
1. `defineAsyncComponent(() => import('./HeavyComponent.vue'))`
2. 含有 `await` 的 `async setup()` 函式

```vue
<Suspense>
  <!-- 非同步元件：setup() 含 await，Suspense 會等它 -->
  <template #default>
    <AsyncUserProfile />
  </template>

  <!-- 在等待期間顯示 fallback -->
  <template #fallback>
    <div class="skeleton">載入中…</div>
  </template>
</Suspense>
```

`onErrorCaptured` 可在父元件捕捉子元件的非同步錯誤。

## 起手式說明
`Starter.vue` 已有一個非同步元件 `AsyncCard`（使用 `defineAsyncComponent` + 模擬 API）。
**需要你從零撰寫：**
1. 用 `<Suspense>` 包住 `<AsyncCard>`
2. 提供 `#fallback` 骨架屏 slot
3. 用 `onErrorCaptured` 捕捉載入錯誤

## 驗收標準
- [ ] 點擊「載入」後顯示骨架屏（fallback）約 1.5 秒
- [ ] 載入成功後顯示實際內容
- [ ] 模擬錯誤時，父元件的 `onErrorCaptured` 能捕捉到並顯示錯誤訊息
- [ ] 再次點擊「重新載入」能重置並重試

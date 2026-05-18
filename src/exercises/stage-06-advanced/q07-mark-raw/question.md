# Q07 — markRaw / readonly / toRaw

## 對應官方文件
- 章節：Advanced Reactivity APIs
- URL：https://vuejs.org/api/reactivity-advanced

## 題型
填空

## 難度
⭐⭐⭐ 進階

## 題目說明
這三個 API 都用於管理響應式系統的邊界：

| API | 用途 |
|---|---|
| `markRaw(obj)` | 標記物件為「永不響應式」（即使放入 reactive/ref 也不會被追蹤）|
| `readonly(source)` | 創建響應式物件的唯讀代理（嘗試修改會發出警告）|
| `toRaw(proxy)` | 從響應式代理取回原始物件（效能優化、第三方 lib 傳參）|

**使用情境：**
```js
// markRaw：第三方 class 實例（Chart、Map 物件等）不應被響應式追蹤
import mapboxgl from 'mapbox-gl'
const mapInstance = markRaw(new mapboxgl.Map({ ... }))
const state = reactive({ map: mapInstance })  // map 不會被代理

// readonly：全域共享設定（只讀、防止意外修改）
const config = readonly(reactive({ apiUrl: '...', version: '1.0' }))

// toRaw：取回原始物件傳給第三方 lib（避免傳 Proxy 進去）
const rawData = toRaw(state.items)
thirdPartyLib.process(rawData)  // 比傳 Proxy 更安全
```

## 起手式說明
`Starter.vue` 有 4 個 TODO 填空，對應三個 API 的使用場景：
1. TODO 1：用 `markRaw` 標記一個模擬的「Chart 實例」
2. TODO 2：用 `readonly` 包住全域設定物件
3. TODO 3：用 `toRaw` 取出原始物件做比較
4. TODO 4：填寫 `isReadonly` / `isReactive` 的預期結果

## 驗收標準
- [ ] markRaw 的物件放入 reactive 後，內部屬性改變不觸發更新
- [ ] readonly 物件嘗試修改時，console 出現警告
- [ ] toRaw 返回的物件 === 原始物件（非 Proxy）
- [ ] isReactive / isReadonly / isProxy 回傳值正確

/// <reference types="vite/client" />

/**
 * 讓 TypeScript 認識 .vue 檔案的型別
 * 若沒有這個宣告，import '*.vue' 時 TS 會報錯
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>
  export default component
}

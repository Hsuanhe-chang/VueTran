<script setup>
/** Q06 — Class 與 Style 動態綁定（從零撰寫） */

// TODO: import ref
// TODO: 建立 isActive (boolean, 初始 false)
// TODO: 建立 isHighlighted (boolean, 初始 false)
// TODO: 建立 fontSize (number, 初始 16, 單位 px)
// TODO: 建立自訂顏色 customColor (string, 初始 '#35495e')
</script>

<template>
  <div class="class-style-demo">
    <h3>🎨 Class & Style 動態綁定練習</h3>

    <!--
      TODO: 為此 div 加上動態 class 與 style：
      - :class 物件語法：當 isActive 為 true 加上 'card-active'
                        當 isHighlighted 為 true 加上 'card-highlighted'
      - :style 物件語法：字型大小用 fontSize + 'px'
                        顏色用 customColor
    -->
    <div class="demo-card">
      <p>這張卡片的樣式由響應式資料控制</p>
      <p>isActive: {{ isActive }} | isHighlighted: {{ isHighlighted }}</p>
      <p>fontSize: {{ fontSize }}px | color: {{ customColor }}</p>
    </div>

    <!-- 控制項 -->
    <div class="controls">
      <!-- TODO: 按鈕切換 isActive -->
      <button class="btn btn-outline">切換 Active</button>

      <!-- TODO: 按鈕切換 isHighlighted -->
      <button class="btn btn-outline">切換 Highlighted</button>

      <!-- TODO: range input 控制 fontSize (min=12, max=32) -->
      <label>
        字型大小：{{ fontSize }}px
        <input type="range" min="12" max="32" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.class-style-demo { padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); display: flex; flex-direction: column; gap: var(--space-lg); }
.demo-card { padding: var(--space-lg); background: var(--color-bg-card); border: 2px solid var(--color-border); border-radius: var(--radius-md); transition: all var(--transition-base); }
.card-active { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(66,184,131,0.2); }
.card-highlighted { background: #fffbeb !important; }
.controls { display: flex; flex-direction: column; gap: var(--space-md); }
label { display: flex; align-items: center; gap: var(--space-md); }
</style>

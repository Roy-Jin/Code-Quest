# PWA 更新功能文档

## 概述

PWA（渐进式 Web 应用）更新功能提供了一种无缝的方式，在应用有新版本时通知用户，并允许他们一键更新。

## 组件

### 1. PwaReloadPrompt 组件

位置：`src/components/PwaReloadPrompt.tsx`

该组件在检测到新版本时显示一个精美的模态对话框：

- **功能特性：**
  - 带背景模糊的动画模态框
  - 旋转的刷新图标
  - 功能亮点展示
  - 两个操作按钮："立即刷新"和"稍后"
  - 完全国际化（英文和中文）
  - 使用 Framer Motion 的流畅动画

### 2. usePwaUpdate Hook

位置：`src/hooks/usePwaUpdate.ts`

这个自定义 Hook 管理 PWA 更新逻辑：

- **功能特性：**
  - 自动注册 Service Worker
  - 定期检查更新（每 60 秒）
  - 更新提示可见性的状态管理
  - 更新和关闭处理器

### 3. 在 App.tsx 中的集成

`PwaReloadPrompt` 组件集成在应用的根级别，确保在有更新时显示在所有其他内容之上。

## 工作原理

1. **Service Worker 注册**：应用加载时，Service Worker 自动注册
2. **更新检测**：应用每 60 秒检查一次更新
3. **用户通知**：检测到更新时，显示 `PwaReloadPrompt` 模态框
4. **用户操作**：
   - 点击"立即刷新" → 应用重新加载新版本
   - 点击"稍后"或背景 → 模态框关闭，用户可以继续使用当前版本

## 国际化

更新提示支持英文和中文：

### 英文
- 标题："New Version Available"
- 描述："We've found a new version. Refresh the page to get the latest features."
- 按钮："Refresh Now" / "Later"

### 中文
- 标题："新版本可用"
- 描述："我们发现了新版本，刷新页面以获取最新功能"
- 按钮："立即刷新" / "稍后"

## 配置

### Vite PWA 插件设置

位置：`vite.config.ts`

```typescript
VitePWA({
  registerType: "prompt",  // 显示提示而不是自动更新
  injectRegister: "auto",  // 自动注入注册代码
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3}"],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
  },
  // ... manifest 配置
})
```

## 测试

### 开发模式

1. 运行开发服务器：`npm run dev`
2. 开发模式下启用了 PWA 功能
3. 打开 DevTools → Application → Service Workers
4. 可以手动触发更新或注销/注册 Service Worker

### 生产模式

1. 构建应用：`npm run build`
2. 提供构建文件：`npm run preview` 或使用静态服务器
3. 进行更改并重新构建
4. 更新提示应该会自动出现

## 最佳实践

1. **更新频率**：当前检查间隔为 60 秒。如需调整，请在 `usePwaUpdate.ts` 中修改
2. **用户体验**："稍后"选项允许用户继续工作而不被打断
3. **数据安全**：更新过程保留所有用户数据（localStorage、IndexedDB）
4. **视觉反馈**：清晰的动画和图标帮助用户理解正在发生的事情

## 自定义

### 样式

组件使用 Tailwind CSS 类。主要样式元素：
- 渐变背景：`from-amber-600 to-orange-600`
- 边框半径：`rounded-2xl`
- 阴影：`shadow-2xl shadow-amber-500/20`

### 动画

动画由 Framer Motion 驱动：
- 模态框入场：缩放和淡入
- 图标旋转：连续 360° 旋转
- 按钮交互：悬停/点击时缩放

### 更新检查间隔

要更改更新检查频率，请在 `usePwaUpdate.ts` 中修改间隔：

```typescript
setInterval(() => {
  registration.update()
}, 60_000) // 更改此值（以毫秒为单位）
```

## 故障排除

### 未检测到更新

1. 清除浏览器缓存和 Service Worker
2. 在 DevTools 中检查 Service Worker 是否已注册
3. 验证构建版本是否确实已更改

### 模态框未出现

1. 检查控制台是否有错误
2. 验证 `PwaReloadPrompt` 是否在 `App.tsx` 中渲染
3. 确保 `usePwaUpdate` Hook 正常工作

### 更新失败

1. 检查网络连接
2. 验证 Service Worker 是否处于活动状态
3. 尝试硬刷新（Ctrl+Shift+R 或 Cmd+Shift+R）

## 未来增强

可能的改进：
- 添加版本号显示
- 在模态框中显示更新日志
- 添加"不再显示"选项
- 实现更新调度
- 添加更新期间的进度指示器

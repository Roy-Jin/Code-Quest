<div align="center">

<img src="public/icons/icon.svg" alt="Code Quest Logo" width="120" height="120" />

# Code Quest

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-0078d4?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/explore/progressive-web-apps)

An interactive coding adventure game that teaches programming concepts through fun challenges.

[English](README.md) | [中文](README_zh.md)

<img src="doc/demo.webp" alt="Code Quest Demo" width="800" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);" />

</div>

## ✨ Key Features

- **🎮 Interactive Gameplay**: Learn programming through engaging puzzle challenges
- **💻 Professional IDE**: Powered by **Monaco Editor** with IntelliSense, syntax highlighting, and advanced editor configurations
- **⚡ Reactive Game Engine**: Custom-built state-driven engine for real-time code interpretation and sandboxed execution
- **💾 Persistent Progress**: Automatic synchronization of game progress and code snippets to local storage
- **🌐 Multilingual Support**: Seamless switching between English and Simplified Chinese
- **📱 PWA Support**: Installable web app with offline capabilities

## 🛠️ Technical Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Motion |
| Editor | Monaco Editor |
| Code Execution | JS-Interpreter (Sandboxed) |
| PWA | Vite PWA Plugin |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Roy-Jin/Code-Quest.git

# Navigate to project directory
cd Code-Quest

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
Code-Quest/
├── public/
│   ├── icons/
│   │   └── icon.svg          # App icon
│   ├── bgm.mp3               # Background music
│   └── coinGet.mp3           # Sound effect
├── src/
│   ├── components/           # React components
│   │   ├── EditorPane.tsx   # Monaco editor wrapper
│   │   ├── GameGrid.tsx     # Game board renderer
│   │   ├── Header.tsx       # App header
│   │   └── ...
│   ├── config/              # Game configuration
│   │   ├── levels/          # Level definitions
│   │   ├── commands.ts      # Available commands
│   │   └── i18n.ts          # Internationalization
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   │   └── useGameEngine.ts # Core game logic
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── GamePage.tsx
│   │   ├── LevelSelectPage.tsx
│   │   ├── LevelEditorPage.tsx
│   │   └── SettingsPage.tsx
│   ├── utils/               # Utility functions
│   └── types.ts             # TypeScript type definitions
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## 🎯 How to Play

1. **Select a Level**: Choose from various challenging levels
2. **Write Code**: Use simple commands to control the character
3. **Run & Debug**: Execute your code and see the results in real-time
4. **Collect Coins**: Reach the goal while collecting all coins
5. **Complete Challenges**: Solve puzzles with optimal solutions

### Available Commands

For a complete reference of all available commands and properties, please see the [Command Reference](doc/commands.md) document.

| Command | Description |
|---------|-------------|
| `moveForward()` | Move forward one cell |
| `turnLeft()` | Turn 90° left |
| `turnRight()` | Turn 90° right |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

GPL v3 License

---

<div align="center">

Built with ❤️ by [Roy-Jin](https://github.com/Roy-Jin)

</div>

import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 'level-1',
    name: { en: 'Hello World', zh: '你好，世界' },
    gridSize: 5,
    startPos: { x: 0, y: 2, dir: 'E' },
    targetPos: { x: 4, y: 2 },
    walls: [],
    coins: [],
    availableCommands: {
      Robot: ['moveForward', 'x', 'y', 'direction', 'speed'],
      Grid: ['size', 'walls', 'coins', 'target'],
      Level: ['requiredScore', 'maxMoves', 'score', 'moves'],
      console: ['log']
    },
    defaultCode: {
      en: "// Level 1\n// Use Robot.moveForward() to reach the target!\n\n// Robot.moveForward()\n// Robot.moveForward()\n// Robot.moveForward()\n// Robot.moveForward()",
      zh: "// 关卡 1\n// 使用 Robot.moveForward() 到达目标点！\n\n// Robot.moveForward()\n// Robot.moveForward()\n// Robot.moveForward()\n// Robot.moveForward()"
    },
    victoryConditions: { maxMoves: 4 },
    difficulty: 0
  },
  {
    id: 'level-2',
    name: { en: 'Turning Around', zh: '转弯' },
    gridSize: 5,
    startPos: { x: 0, y: 0, dir: 'E' },
    targetPos: { x: 4, y: 0 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }
    ],
    coins: [],
    availableCommands: {
      Robot: ['moveForward', 'turnLeft', 'turnRight', 'x', 'y', 'direction', 'speed'],
      Grid: ['size', 'walls', 'coins', 'target'],
      Level: ['requiredScore', 'maxMoves', 'score', 'moves'],
      console: ['log']
    },
    defaultCode: {
      en: "// Level 2\n// Watch out for the walls!\n\n",
      zh: "// 关卡 2\n// 小心墙壁！\n\n"
    },
    victoryConditions: { maxMoves: 10 },
    difficulty: 1
  },
  {
    id: 'level-3',
    name: { en: 'Coin Collector', zh: '金币收集者' },
    gridSize: 6,
    startPos: { x: 0, y: 0, dir: 'S' },
    targetPos: { x: 5, y: 5 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }
    ],
    coins: [
      { x: 0, y: 5, tier: 1 }, // Wood
      { x: 3, y: 0, tier: 1 }  // Wood
    ],
    availableCommands: {
      Robot: ['moveForward', 'turnLeft', 'turnRight', 'x', 'y', 'direction', 'speed'],
      Grid: ['size', 'walls', 'coins', 'target'],
      Level: ['requiredScore', 'maxMoves', 'score', 'moves'],
      console: ['log']
    },
    defaultCode: {
      en: "// Level 3\n// Collect all coins before reaching the target!\n// Coins are collected automatically when you move onto them.\n// Wood coins = 1 point each\n\n",
      zh: "// 关卡 3\n// 在到达目标前收集所有金币！\n// 移动到金币上会自动收集。\n// 木质金币 = 每个 1 分\n\n"
    },
    victoryConditions: { requiredScore: 2 },
    difficulty: 2
  },
  {
    id: 'level-4',
    name: { en: 'Zig Zag', zh: 'Z字形' },
    gridSize: 6,
    startPos: { x: 0, y: 0, dir: 'E' },
    targetPos: { x: 5, y: 5 },
    walls: [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }
    ],
    coins: [
      { x: 2, y: 0, tier: 1 }, // Wood
      { x: 4, y: 5, tier: 1 }  // Wood
    ],
    availableCommands: {
      Robot: ['moveForward', 'turnLeft', 'turnRight', 'x', 'y', 'direction', 'speed'],
      Grid: ['size', 'walls', 'coins', 'target'],
      Level: ['requiredScore', 'maxMoves', 'score', 'moves'],
      console: ['log']
    },
    defaultCode: {
      en: "// Level 4\n// Navigate the zig-zag path!\n// Coins are collected automatically.\n\n",
      zh: "// 关卡 4\n// 穿越 Z 字形路径！\n// 金币会自动收集。\n\n"
    },
    victoryConditions: { requiredScore: 2, maxMoves: 18 },
    difficulty: 2
  },
  {
    id: 'level-5',
    name: { en: 'The Maze', zh: '迷宫' },
    gridSize: 10,
    startPos: { x: 0, y: 9, dir: 'N' },
    targetPos: { x: 8, y: 0 },
    walls: [
      { x: 0, y: 4 },
      { x: 1, y: 9 }, { x: 1, y: 8 }, { x: 1, y: 7 }, { x: 1, y: 6 },
      { x: 1, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 }, { x: 1, y: 1 },
      { x: 3, y: 8 }, { x: 3, y: 7 }, { x: 3, y: 6 }, { x: 3, y: 5 },
      { x: 3, y: 4 }, { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 0 },
      { x: 4, y: 2},
      { x: 5, y: 9 }, { x: 5, y: 8 }, { x: 5, y: 6 }, { x: 5, y: 5 },
      { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 },
      { x: 7, y: 8 }, { x: 7, y: 7 }, { x: 7, y: 6 }, { x: 7, y: 5 },
      { x: 7, y: 4 }, { x: 7, y: 3 }, { x: 7, y: 2 }, { x: 7, y: 1 }, { x: 7, y: 0 },
      { x: 8, y: 2 }, { x: 8, y: 8 }, { x: 9, y: 5 }
    ],
    coins: [
      { x: 0, y: 3, tier: 1 }, // Wood
      { x: 4, y: 1, tier: 2 }, // Silver
      { x: 4, y: 9, tier: 1 }, // Wood
      { x: 8, y: 5, tier: 2 }  // Silver
    ],
    availableCommands: {
      Robot: ['moveForward', 'turnLeft', 'turnRight', 'x', 'y', 'direction', 'speed'],
      Grid: ['size', 'walls', 'coins', 'target'],
      Level: ['requiredScore', 'maxMoves', 'score', 'moves'],
      console: ['log']
    },
    defaultCode: {
      en: "// Level 5\n// Find your way through the complex 10x10 maze!\n// Wood coins = 1 point, Silver coins = 5 points\n// Hint: You might want to write a function to help you navigate.\n\n",
      zh: "// 关卡 5\n// 找到穿越复杂 10x10 迷宫的路径！\n// 木质金币 = 1 分，银质金币 = 5 分\n// 提示：你可能需要编写一个函数来帮助导航。\n\n"
    },
    victoryConditions: { requiredScore: 12 },
    difficulty: 3
  },
  {
    id: 'level-6',
    name: { en: 'Treasure Hunter', zh: '寻宝猎人' },
    gridSize: 8,
    startPos: { x: 0, y: 0, dir: 'E' },
    targetPos: { x: 7, y: 7 },
    walls: [
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 },
      { x: 4, y: 1 }, { x: 4, y: 2 },
      { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 },
      { x: 1, y: 6 }, { x: 2, y: 6 }
    ],
    coins: [
      { x: 1, y: 1, tier: 1 }, // Wood
      { x: 3, y: 2, tier: 2 }, // Silver
      { x: 6, y: 3, tier: 1 }, // Wood
      { x: 3, y: 5, tier: 3 }, // Gold
      { x: 6, y: 6, tier: 4 }  // Diamond
    ],
    pressurePlates: [
      { x: 0, y: 3, tier: 1 }, // Resets Wood coins
      { x: 0, y: 5, tier: 2 }, // Resets Silver coins
      { x: 7, y: 1, tier: 3 }, // Resets Gold coins
      { x: 7, y: 3, tier: 4 }  // Resets Diamond coins
    ],
    availableCommands: {
      Robot: ['moveForward', 'turnLeft', 'turnRight', 'x', 'y', 'direction', 'speed'],
      Grid: ['size', 'walls', 'coins', 'target'],
      Level: ['requiredScore', 'maxMoves', 'score', 'moves'],
      console: ['log']
    },
    defaultCode: {
      en: "// Level 6 - Treasure Hunter\n// Wood = 1pt, Silver = 5pts, Gold = 15pts, Diamond = 25pts\n// Pressure plates reset coins of matching tier!\n// Wood plate (0,3), Silver (0,5), Gold (7,1), Diamond (7,3)\n// Strategy: Reset and collect high-value coins multiple times!\n\n",
      zh: "// 关卡 6 - 寻宝猎人\n// 木质 = 1分，银质 = 5分，金质 = 15分，钻石 = 25分\n// 压力板会重置对应等级的金币！\n// 木质板 (0,3)，银质 (0,5)，金质 (7,1)，钻石 (7,3)\n// 策略：重置并多次收集高价值金币！\n\n"
    },
    victoryConditions: { requiredScore: 70 },
    difficulty: 3
  }
];

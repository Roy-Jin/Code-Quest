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
    availableCommands: ['moveForward', 'log', 'getGrid', 'getRobotState', 'getObjectives', 'getCurrentState', 'setSpeed', 'getSpeed'],
    defaultCode: "// Level 1\n// Use moveForward() to reach the target!\n\n// moveForward()\n// moveForward()\n// moveForward()\n// moveForward()",
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
    availableCommands: ['moveForward', 'turnRight', 'turnLeft', 'log', 'getGrid', 'getRobotState', 'getObjectives', 'getCurrentState', 'setSpeed', 'getSpeed'],
    defaultCode: "// Level 2\n// Watch out for the walls!\n\n",
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
      { x: 0, y: 5 }, { x: 3, y: 0}
    ],
    availableCommands: ['moveForward', 'turnRight', 'turnLeft', 'collectCoin', 'log', 'getGrid', 'getRobotState', 'getObjectives', 'getCurrentState', 'setSpeed', 'getSpeed'],
    defaultCode: "// Level 3\n// Collect all coins before reaching the target!\n// Use collectCoin() to collect a coin at the current position.\n\n",
    victoryConditions: { requiredCoins: 2 },
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
      { x: 2, y: 0 }, { x: 4, y: 5 }
    ],
    availableCommands: ['moveForward', 'turnRight', 'turnLeft', 'collectCoin', 'log', 'getGrid', 'getRobotState', 'getObjectives', 'getCurrentState', 'setSpeed', 'getSpeed'],
    defaultCode: "// Level 4\n// Navigate the zig-zag path!\n\n",
    victoryConditions: { requiredCoins: 2, maxMoves: 18 },
    difficulty: 2
  },
  {
    id: 'level-5',
    name: { en: 'The Maze', zh: '迷宫' },
    gridSize: 10,
    startPos: { x: 0, y: 9, dir: 'N' },
    targetPos: { x: 8, y: 0 },
    walls: [
      // Outer boundaries (optional, but good for maze structure)
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
      { x: 0, y: 3 }, { x: 4, y: 1}, { x: 4, y: 9 }, { x: 8, y: 5 }
    ],
    availableCommands: ['moveForward', 'turnRight', 'turnLeft', 'collectCoin', 'log', 'getGrid', 'getRobotState', 'getObjectives', 'getCurrentState', 'setSpeed', 'getSpeed'],
    defaultCode: "// Level 5\n// Find your way through the complex 10x10 maze!\n// Hint: You might want to write a function to help you navigate.\n\n",
    victoryConditions: { requiredCoins: 4 },
    difficulty: 3
  }
];

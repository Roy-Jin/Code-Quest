export interface CommandMeta {
  id: string;
  signature: string;
  description: { en: string; zh: string };
  getTsDefinition: (lang: 'en' | 'zh') => string;
}

// Helper function to create TypeScript definitions
const createTsDef = (comment: { en: string; zh: string }, signature: string) => {
  return (lang: 'en' | 'zh') => `/** ${comment[lang]} */\n${signature}`;
};

export const COMMAND_REGISTRY: Record<string, CommandMeta> = {
  moveForward: {
    id: 'moveForward',
    signature: 'moveForward()',
    description: { en: 'Moves the robot forward one step.', zh: '向前移动一步。' },
    getTsDefinition: createTsDef(
      { en: 'Moves the robot forward one step.', zh: '向前移动一步' },
      'declare function moveForward(): void;'
    )
  },
  turnLeft: {
    id: 'turnLeft',
    signature: 'turnLeft()',
    description: { en: 'Turns the robot 90 degrees to the left.', zh: '向左转90度。' },
    getTsDefinition: createTsDef(
      { en: 'Turns the robot 90 degrees to the left.', zh: '向左转90度' },
      'declare function turnLeft(): void;'
    )
  },
  turnRight: {
    id: 'turnRight',
    signature: 'turnRight()',
    description: { en: 'Turns the robot 90 degrees to the right.', zh: '向右转90度。' },
    getTsDefinition: createTsDef(
      { en: 'Turns the robot 90 degrees to the right.', zh: '向右转90度' },
      'declare function turnRight(): void;'
    )
  },
  collectCoin: {
    id: 'collectCoin',
    signature: 'collectCoin()',
    description: { en: 'Collects a coin at the current position.', zh: '收集当前位置的金币。' },
    getTsDefinition: createTsDef(
      { en: 'Collects a coin at the current position.', zh: '收集当前位置的金币' },
      'declare function collectCoin(): void;'
    )
  },
  log: {
    id: 'log',
    signature: 'console.log(msg)',
    description: { en: 'Prints a message to the console.', zh: '在控制台打印一条消息。' },
    getTsDefinition: (lang) => lang === 'en'
      ? 'declare namespace console {\n  /** Prints a message to the console. */\n  function log(msg: any): void;\n}'
      : 'declare namespace console {\n  /** 在控制台打印一条消息 */\n  function log(msg: any): void;\n}'
  },
  getGrid: {
    id: 'getGrid',
    signature: 'getGrid()',
    description: { en: 'Returns grid size, walls, and coins.', zh: '获取网格大小、墙壁和金币信息。' },
    getTsDefinition: createTsDef(
      { en: 'Returns grid size, walls, and coins information.', zh: '获取网格大小、墙壁和金币信息' },
      'declare function getGrid(): { size: number; walls: { x: number; y: number }[]; coins: { x: number; y: number; tier: number }[] };'
    )
  },
  getRobotState: {
    id: 'getRobotState',
    signature: 'getRobotState()',
    description: { en: 'Returns robot coordinates and direction.', zh: '获取机器人坐标和方向。' },
    getTsDefinition: createTsDef(
      { en: 'Returns robot coordinates and direction.', zh: '获取机器人坐标和方向' },
      'declare function getRobotState(): { x: number; y: number; dir: "N" | "E" | "S" | "W" };'
    )
  },
  getObjectives: {
    id: 'getObjectives',
    signature: 'getObjectives()',
    description: { en: 'Returns level objectives.', zh: '获取关卡目标限制。' },
    getTsDefinition: createTsDef(
      { en: 'Returns level objectives including required score and max moves.', zh: '获取关卡目标，包括所需分数和最大步数' },
      'declare function getObjectives(): { requiredScore?: number; maxMoves?: number };'
    )
  },
  getCurrentState: {
    id: 'getCurrentState',
    signature: 'getCurrentState()',
    description: { en: 'Returns current moves and score.', zh: '获取当前步数和分数。' },
    getTsDefinition: createTsDef(
      { en: 'Returns current score and move count.', zh: '获取当前分数和步数' },
      'declare function getCurrentState(): { score: number; moves: number };'
    )
  },
  setSpeed: {
    id: 'setSpeed',
    signature: 'setSpeed(ms)',
    description: { en: 'Sets the animation delay in milliseconds.', zh: '设置动画延迟（毫秒）。' },
    getTsDefinition: createTsDef(
      { en: 'Sets the animation delay in milliseconds.', zh: '设置动画延迟（毫秒）' },
      'declare function setSpeed(ms: number): void;'
    )
  },
  getSpeed: {
    id: 'getSpeed',
    signature: 'getSpeed()',
    description: { en: 'Returns current animation delay.', zh: '获取当前动画延迟。' },
    getTsDefinition: createTsDef(
      { en: 'Returns current animation delay in milliseconds.', zh: '获取当前动画延迟（毫秒）' },
      'declare function getSpeed(): number;'
    )
  }
};

export interface CommandMeta {
  id: string;
  signature: string;
  description: { en: string; zh: string };
  tsDefinition: string;
}

export const COMMAND_REGISTRY: Record<string, CommandMeta> = {
  moveForward: {
    id: 'moveForward',
    signature: 'moveForward()',
    description: { en: 'Moves the robot forward one step.', zh: '向前移动一步。' },
    tsDefinition: '/** Moves the robot forward one step. / 向前移动一步 */\ndeclare function moveForward(): void;'
  },
  turnLeft: {
    id: 'turnLeft',
    signature: 'turnLeft()',
    description: { en: 'Turns the robot 90 degrees to the left.', zh: '向左转90度。' },
    tsDefinition: '/** Turns the robot 90 degrees to the left. / 向左转90度 */\ndeclare function turnLeft(): void;'
  },
  turnRight: {
    id: 'turnRight',
    signature: 'turnRight()',
    description: { en: 'Turns the robot 90 degrees to the right.', zh: '向右转90度。' },
    tsDefinition: '/** Turns the robot 90 degrees to the right. / 向右转90度 */\ndeclare function turnRight(): void;'
  },
  collectCoin: {
    id: 'collectCoin',
    signature: 'collectCoin()',
    description: { en: 'Collects a coin at the current position.', zh: '收集当前位置的金币。' },
    tsDefinition: '/** Collects a coin at the current position. / 收集当前位置的金币 */\ndeclare function collectCoin(): void;'
  },
  log: {
    id: 'log',
    signature: 'console.log(msg)',
    description: { en: 'Prints a message to the console.', zh: '在控制台打印一条消息。' },
    tsDefinition: 'declare namespace console {\n  /** Prints a message to the console. / 在控制台打印一条消息。 */\n  function log(msg: any): void;\n}'
  },
  getGrid: {
    id: 'getGrid',
    signature: 'getGrid()',
    description: { en: 'Returns grid size, walls, and coins.', zh: '获取网格大小、墙壁和金币信息。' },
    tsDefinition: '/** Returns grid size, walls, and coins. / 获取网格大小、墙壁和金币信息。 */\ndeclare function getGrid(): { size: number, walls: {x: number, y: number}[], coins: {x: number, y: number}[] };'
  },
  getRobotState: {
    id: 'getRobotState',
    signature: 'getRobotState()',
    description: { en: 'Returns robot coordinates and direction.', zh: '获取机器人坐标和方向。' },
    tsDefinition: '/** Returns robot coordinates and direction. / 获取机器人坐标和方向。 */\ndeclare function getRobotState(): { x: number, y: number, dir: string };'
  },
  getObjectives: {
    id: 'getObjectives',
    signature: 'getObjectives()',
    description: { en: 'Returns level objectives.', zh: '获取关卡目标限制。' },
    tsDefinition: '/** Returns level objectives. / 获取关卡目标限制。 */\ndeclare function getObjectives(): { requiredCoins: number, maxMoves: number };'
  },
  getCurrentState: {
    id: 'getCurrentState',
    signature: 'getCurrentState()',
    description: { en: 'Returns current moves and collected coins.', zh: '获取当前步数和已收集金币数。' },
    tsDefinition: '/** Returns current moves and collected coins. / 获取当前步数和已收集金币数。 */\ndeclare function getCurrentState(): { collectedCoins: number, moves: number };'
  },
  setSpeed: {
    id: 'setSpeed',
    signature: 'setSpeed(ms)',
    description: { en: 'Sets the animation delay in milliseconds.', zh: '设置动画延迟（毫秒）。' },
    tsDefinition: '/** Sets the animation delay in milliseconds. / 设置动画延迟（毫秒）。 */\ndeclare function setSpeed(ms: number): void;'
  },
  getSpeed: {
    id: 'getSpeed',
    signature: 'getSpeed()',
    description: { en: 'Returns current animation delay.', zh: '获取当前动画延迟。' },
    tsDefinition: '/** Returns current animation delay. / 获取当前动画延迟。 */\ndeclare function getSpeed(): number;'
  }
};

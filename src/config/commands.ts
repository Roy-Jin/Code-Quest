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
  // Robot methods
  moveForward: {
    id: 'moveForward',
    signature: 'Robot.moveForward()',
    description: { en: 'Moves the robot forward one step.', zh: '向前移动一步。' },
    getTsDefinition: createTsDef(
      { en: 'Moves the robot forward one step.', zh: '向前移动一步' },
      'moveForward(): void;'
    )
  },
  turnLeft: {
    id: 'turnLeft',
    signature: 'Robot.turnLeft()',
    description: { en: 'Turns the robot 90 degrees to the left.', zh: '向左转90度。' },
    getTsDefinition: createTsDef(
      { en: 'Turns the robot 90 degrees to the left.', zh: '向左转90度' },
      'turnLeft(): void;'
    )
  },
  turnRight: {
    id: 'turnRight',
    signature: 'Robot.turnRight()',
    description: { en: 'Turns the robot 90 degrees to the right.', zh: '向右转90度。' },
    getTsDefinition: createTsDef(
      { en: 'Turns the robot 90 degrees to the right.', zh: '向右转90度' },
      'turnRight(): void;'
    )
  },
  
  // Robot properties
  robotX: {
    id: 'robotX',
    signature: 'Robot.x',
    description: { en: 'Robot X coordinate (read-only).', zh: '机器人X坐标（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Robot X coordinate (read-only).', zh: '机器人X坐标（只读）' },
      'readonly x: number;'
    )
  },
  robotY: {
    id: 'robotY',
    signature: 'Robot.y',
    description: { en: 'Robot Y coordinate (read-only).', zh: '机器人Y坐标（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Robot Y coordinate (read-only).', zh: '机器人Y坐标（只读）' },
      'readonly y: number;'
    )
  },
  robotDir: {
    id: 'robotDir',
    signature: 'Robot.direction',
    description: { en: 'Robot direction: N, E, S, W (read-only).', zh: '机器人方向：N, E, S, W（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Robot direction: N, E, S, W (read-only).', zh: '机器人方向：N, E, S, W（只读）' },
      'readonly direction: "N" | "E" | "S" | "W";'
    )
  },
  robotSpeed: {
    id: 'robotSpeed',
    signature: 'Robot.speed',
    description: { en: 'Animation speed in milliseconds (read/write).', zh: '动画速度（毫秒）（可读写）。' },
    getTsDefinition: createTsDef(
      { en: 'Animation speed in milliseconds (read/write).', zh: '动画速度（毫秒）（可读写）' },
      'speed: number;'
    )
  },

  // Grid properties
  gridSize: {
    id: 'gridSize',
    signature: 'Grid.size',
    description: { en: 'Grid size (read-only).', zh: '网格大小（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Grid size (read-only).', zh: '网格大小（只读）' },
      'readonly size: number;'
    )
  },
  gridWalls: {
    id: 'gridWalls',
    signature: 'Grid.walls',
    description: { en: 'Array of wall positions (read-only).', zh: '墙壁位置数组（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Array of wall positions (read-only).', zh: '墙壁位置数组（只读）' },
      'readonly walls: { x: number; y: number }[];'
    )
  },
  gridCoins: {
    id: 'gridCoins',
    signature: 'Grid.coins',
    description: { en: 'Array of coin positions and tiers (read-only).', zh: '金币位置和等级数组（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Array of coin positions and tiers (read-only).', zh: '金币位置和等级数组（只读）' },
      'readonly coins: { x: number; y: number; tier: number }[];'
    )
  },
  gridTarget: {
    id: 'gridTarget',
    signature: 'Grid.target',
    description: { en: 'Target position (read-only).', zh: '目标位置（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Target position (read-only).', zh: '目标位置（只读）' },
      'readonly target: { x: number; y: number };'
    )
  },

  // Level objectives
  requiredScore: {
    id: 'requiredScore',
    signature: 'Level.requiredScore',
    description: { en: 'Required score to win (read-only).', zh: '获胜所需分数（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Required score to win (read-only).', zh: '获胜所需分数（只读）' },
      'readonly requiredScore: number;'
    )
  },
  maxMoves: {
    id: 'maxMoves',
    signature: 'Level.maxMoves',
    description: { en: 'Maximum allowed moves (read-only).', zh: '最大允许步数（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Maximum allowed moves (read-only).', zh: '最大允许步数（只读）' },
      'readonly maxMoves: number;'
    )
  },
  currentScore: {
    id: 'currentScore',
    signature: 'Level.score',
    description: { en: 'Current score (read-only).', zh: '当前分数（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Current score (read-only).', zh: '当前分数（只读）' },
      'readonly score: number;'
    )
  },
  currentMoves: {
    id: 'currentMoves',
    signature: 'Level.moves',
    description: { en: 'Current move count (read-only).', zh: '当前步数（只读）。' },
    getTsDefinition: createTsDef(
      { en: 'Current move count (read-only).', zh: '当前步数（只读）' },
      'readonly moves: number;'
    )
  },

  // Console
  log: {
    id: 'log',
    signature: 'console.log(msg)',
    description: { en: 'Prints a message to the console.', zh: '在控制台打印一条消息。' },
    getTsDefinition: (lang) => lang === 'en'
      ? 'declare namespace console {\n  /** Prints a message to the console. */\n  function log(msg: any): void;\n}'
      : 'declare namespace console {\n  /** 在控制台打印一条消息 */\n  function log(msg: any): void;\n}'
  }
};

// Generate TypeScript definitions for OOP API
export const generateOOPDefinitions = (availableCommands: string[], lang: 'en' | 'zh'): string => {
  const robotMethods: string[] = [];
  const robotProps: string[] = [];
  const gridProps: string[] = [];
  const levelProps: string[] = [];
  
  availableCommands.forEach(cmd => {
    const meta = COMMAND_REGISTRY[cmd];
    if (!meta) return;
    
    const def = meta.getTsDefinition(lang);
    
    // Robot methods
    if (['moveForward', 'turnLeft', 'turnRight'].includes(cmd)) {
      robotMethods.push(`  ${def}`);
    }
    // Robot properties
    else if (['robotX', 'robotY', 'robotDir', 'robotSpeed'].includes(cmd)) {
      robotProps.push(`  ${def}`);
    }
    // Grid properties
    else if (['gridSize', 'gridWalls', 'gridCoins', 'gridTarget'].includes(cmd)) {
      gridProps.push(`  ${def}`);
    }
    // Level properties
    else if (['requiredScore', 'maxMoves', 'currentScore', 'currentMoves'].includes(cmd)) {
      levelProps.push(`  ${def}`);
    }
  });

  let definitions = '';
  
  // Robot object (not a class, just a constant with methods and properties)
  if (robotMethods.length > 0 || robotProps.length > 0) {
    const robotComment = lang === 'en' ? '/** Robot controller */' : '/** 机器人控制器 */';
    definitions += `${robotComment}\ndeclare const Robot: {\n`;
    definitions += robotProps.join('\n') + (robotProps.length > 0 ? '\n' : '');
    definitions += robotMethods.join('\n') + '\n';
    definitions += '};\n\n';
  }

  // Grid object
  if (gridProps.length > 0) {
    const gridComment = lang === 'en' ? '/** Grid information */' : '/** 网格信息 */';
    definitions += `${gridComment}\ndeclare const Grid: {\n`;
    definitions += gridProps.join('\n') + '\n';
    definitions += '};\n\n';
  }

  // Level object
  if (levelProps.length > 0) {
    const levelComment = lang === 'en' ? '/** Level objectives and state */' : '/** 关卡目标和状态 */';
    definitions += `${levelComment}\ndeclare const Level: {\n`;
    definitions += levelProps.join('\n') + '\n';
    definitions += '};\n\n';
  }

  // Console (if log is available)
  if (availableCommands.includes('log')) {
    definitions += COMMAND_REGISTRY.log.getTsDefinition(lang);
  }

  return definitions;
};

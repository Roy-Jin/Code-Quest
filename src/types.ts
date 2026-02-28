export type Direction = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
  dir: Direction;
  rotation?: number;
}

export interface VictoryConditions {
  maxMoves?: number;
  requiredCoins?: number;
}

export interface LevelConfig {
  id: string;
  name: { en: string; zh: string };
  gridSize: number;
  startPos: Position;
  targetPos: { x: number; y: number };
  walls: { x: number; y: number }[];
  coins: { x: number; y: number }[];
  availableCommands: string[];
  defaultCode: string;
  victoryConditions?: VictoryConditions;
  difficulty: number;
}

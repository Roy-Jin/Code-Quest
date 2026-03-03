import { LevelConfig } from '../types';

import TeachingLevel from "./levels/TeachingLevel.json"
import TurnRight from "./levels/TurnRight.json"
import TurnLeft from "./levels/TurnLeft.json"
import ZigZag from "./levels/ZigZag.json"
import GetCoin from "./levels/GetCoin.json"
import OptimalSolution from "./levels/OptimalSolution.json"
import Maze1 from "./levels/Maze1.json"

export const LEVELS: LevelConfig[] = [
  TeachingLevel as LevelConfig,
  TurnRight as LevelConfig,
  TurnLeft as LevelConfig,
  ZigZag as LevelConfig,
  GetCoin as LevelConfig,
  OptimalSolution as LevelConfig,
  Maze1 as LevelConfig,
];

/**
 * Group levels by difficulty
 */
export function getLevelsByDifficulty(): Map<number, LevelConfig[]> {
  const grouped = new Map<number, LevelConfig[]>();
  
  LEVELS.forEach(level => {
    const difficulty = level.difficulty;
    if (!grouped.has(difficulty)) {
      grouped.set(difficulty, []);
    }
    grouped.get(difficulty)!.push(level);
  });
  
  return grouped;
}

/**
 * Get all difficulty levels in ascending order
 */
export function getDifficultyLevels(): number[] {
  const difficulties = new Set(LEVELS.map(l => l.difficulty));
  return Array.from(difficulties).sort((a, b) => a - b);
}
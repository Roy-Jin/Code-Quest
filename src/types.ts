/**
 * Direction the robot is facing
 */
export type Direction = 'N' | 'E' | 'S' | 'W';

/**
 * Robot position and orientation
 */
export interface Position {
  x: number;
  y: number;
  dir: Direction;
  rotation?: number;
}

/**
 * Coin tier levels:
 * - 1: Wood (1 point)
 * - 2: Silver (5 points)
 * - 3: Gold (15 points)
 * - 4: Diamond (25 points)
 */
export type CoinTier = 1 | 2 | 3 | 4;

/**
 * Collectible coin on the grid
 */
export interface Coin {
  x: number;
  y: number;
  tier: CoinTier;
}

/**
 * Pressure plate that resets coins of matching tier when stepped on
 */
export interface PressurePlate {
  x: number;
  y: number;
  tier: CoinTier;
}

/**
 * Level completion requirements
 */
export interface VictoryConditions {
  /** Maximum number of moves allowed */
  maxMoves?: number;
  /** Minimum score required to complete the level */
  requiredScore?: number;
}

/**
 * Available API namespaces for level configuration
 */
export interface AvailableAPIs {
  Robot?: string[];
  Grid?: string[];
  Level?: string[];
  console?: string[];
}

/**
 * Complete level configuration
 */
export interface LevelConfig {
  id: string;
  name: { en: string; zh: string };
  gridSize: number;
  startPos: Position;
  targetPos: { x: number; y: number };
  walls: { x: number; y: number }[];
  coins: Coin[];
  pressurePlates?: PressurePlate[];
  availableCommands: AvailableAPIs;
  defaultCode: { en: string; zh: string };
  victoryConditions?: VictoryConditions;
  difficulty: number;
}

/**
 * Helper to convert API configuration to command list
 */
export function apiConfigToCommands(apis: AvailableAPIs): string[] {
  const commands: string[] = [];
  
  if (apis.Robot) {
    apis.Robot.forEach(item => {
      if (['moveForward', 'turnLeft', 'turnRight'].includes(item)) {
        commands.push(item);
      } else if (item === 'x') {
        commands.push('robotX');
      } else if (item === 'y') {
        commands.push('robotY');
      } else if (item === 'direction') {
        commands.push('robotDir');
      } else if (item === 'speed') {
        commands.push('robotSpeed');
      }
    });
  }
  
  if (apis.Grid) {
    apis.Grid.forEach(item => {
      if (item === 'size') commands.push('gridSize');
      else if (item === 'walls') commands.push('gridWalls');
      else if (item === 'coins') commands.push('gridCoins');
      else if (item === 'target') commands.push('gridTarget');
    });
  }
  
  if (apis.Level) {
    apis.Level.forEach(item => {
      if (item === 'requiredScore') commands.push('requiredScore');
      else if (item === 'maxMoves') commands.push('maxMoves');
      else if (item === 'score') commands.push('currentScore');
      else if (item === 'moves') commands.push('currentMoves');
    });
  }
  
  if (apis.console) {
    if (apis.console.includes('log')) {
      commands.push('log');
    }
  }
  
  return commands;
}

/**
 * Utility class for coin scoring and styling
 */
export class CoinSystem {
  /** Point values for each coin tier */
  static readonly TIER_SCORES: Record<CoinTier, number> = {
    1: 1,   // Wood
    2: 5,   // Silver
    3: 15,  // Gold
    4: 25   // Diamond
  };

  /** Visual styling for each coin tier */
  static readonly TIER_COLORS = {
    1: { // Wood - Brown/Tan colors
      gradient: 'from-amber-800 via-amber-700 to-yellow-900',
      shadow: 'shadow-[0_0_12px_rgba(146,64,14,0.6)]',
      border: 'border-amber-900',
      glow: 'rgba(146,64,14,0.6)'
    },
    2: { // Silver - Bright metallic silver
      gradient: 'from-gray-300 via-slate-100 to-gray-400',
      shadow: 'shadow-[0_0_15px_rgba(203,213,225,0.8)]',
      border: 'border-gray-200',
      glow: 'rgba(203,213,225,0.8)'
    },
    3: { // Gold - Rich golden yellow
      gradient: 'from-yellow-500 via-yellow-400 to-amber-500',
      shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.9)]',
      border: 'border-yellow-400',
      glow: 'rgba(234,179,8,0.9)'
    },
    4: { // Diamond - Cyan/Blue sparkle
      gradient: 'from-cyan-300 via-blue-200 to-cyan-400',
      shadow: 'shadow-[0_0_25px_rgba(34,211,238,1)]',
      border: 'border-cyan-300',
      glow: 'rgba(34,211,238,1)'
    }
  };

  /** Visual styling for each pressure plate tier */
  static readonly PLATE_COLORS = {
    1: { // Wood plate
      gradient: 'from-amber-800 via-amber-700 to-yellow-900',
      border: 'border-amber-900',
      shadow: 'shadow-[0_0_10px_rgba(146,64,14,0.5)]'
    },
    2: { // Silver plate
      gradient: 'from-gray-600 via-slate-500 to-gray-700',
      border: 'border-gray-400',
      shadow: 'shadow-[0_0_10px_rgba(203,213,225,0.6)]'
    },
    3: { // Gold plate
      gradient: 'from-yellow-600 via-yellow-500 to-amber-700',
      border: 'border-yellow-400',
      shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.6)]'
    },
    4: { // Diamond plate
      gradient: 'from-cyan-600 via-blue-500 to-cyan-700',
      border: 'border-cyan-400',
      shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.7)]'
    }
  };

  /**
   * Get the point value for a coin tier
   * @param tier - The coin tier (1-4)
   * @returns Point value
   */
  static getScore(tier: CoinTier): number {
    return this.TIER_SCORES[tier];
  }

  /**
   * Generate a unique key for a coin position
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns Unique key string
   */
  static getCoinKey(x: number, y: number): string {
    return `${x},${y}`;
  }
}

/**
 * Manages game state including score, moves, and coin collection
 */
export class GameState {
  private _score: number = 0;
  private _moveCount: number = 0;
  private _collectedCoins: Map<string, number> = new Map();
  private _visibleCoins: Map<string, Coin> = new Map();

  /**
   * Initialize game state with level coins
   * @param coins - Array of coins in the level
   */
  constructor(coins: Coin[]) {
    this.initializeCoins(coins);
  }

  private initializeCoins(coins: Coin[]): void {
    this._visibleCoins.clear();
    coins.forEach(coin => {
      const key = CoinSystem.getCoinKey(coin.x, coin.y);
      this._visibleCoins.set(key, coin);
    });
  }

  /**
   * Collect a coin at the current position
   * @param coin - The coin to collect
   * @returns true if coin was collected, false if not visible
   */
  collectCoin(coin: Coin): boolean {
    const key = CoinSystem.getCoinKey(coin.x, coin.y);
    
    if (!this._visibleCoins.has(key)) {
      return false;
    }

    this._visibleCoins.delete(key);
    
    const currentCount = this._collectedCoins.get(key) || 0;
    this._collectedCoins.set(key, currentCount + 1);
    
    this._score += CoinSystem.getScore(coin.tier);
    
    return true;
  }

  /**
   * Reset all coins of a specific tier (used by pressure plates)
   * @param coins - Original level coins
   * @param tier - Tier of coins to reset
   */
  resetCoinsByTier(coins: Coin[], tier: CoinTier): void {
    coins
      .filter(coin => coin.tier === tier)
      .forEach(coin => {
        const key = CoinSystem.getCoinKey(coin.x, coin.y);
        this._visibleCoins.set(key, coin);
      });
  }

  /**
   * Increment the move counter
   */
  incrementMoveCount(): void {
    this._moveCount++;
  }

  /** Current total score */
  get score(): number {
    return this._score;
  }

  /** Current number of moves */
  get moveCount(): number {
    return this._moveCount;
  }

  /** Map of currently visible coins */
  get visibleCoins(): Map<string, Coin> {
    return new Map(this._visibleCoins);
  }

  /** Map of collected coin counts by position */
  get collectedCoins(): Map<string, number> {
    return new Map(this._collectedCoins);
  }

  /**
   * Reset game state to initial conditions
   * @param coins - Original level coins
   */
  reset(coins: Coin[]): void {
    this._score = 0;
    this._moveCount = 0;
    this._collectedCoins.clear();
    this.initializeCoins(coins);
  }
}

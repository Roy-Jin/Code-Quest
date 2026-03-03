import { useState, useRef } from 'react';
import * as Babel from '@babel/standalone';
// @ts-ignore
import Interpreter from 'js-interpreter';
import { Position, LevelConfig, Direction, GameState, CoinSystem, Coin, CoinTier, apiConfigToCommands } from '../types';
import { audioManager } from '../utils/audioManager';

const getInitialRotation = (dir: Direction) => {
  if (dir === 'N') return 0;
  if (dir === 'E') return 90;
  if (dir === 'S') return 180;
  if (dir === 'W') return 270;
  return 0;
};

export function useGameEngine(levelConfig: LevelConfig, t: any, onSuccess: () => void, defaultSpeed: number = 400) {
  const [position, setPosition] = useState<Position>({ ...levelConfig.startPos, rotation: getInitialRotation(levelConfig.startPos.dir) });
  const [score, setScore] = useState(0);
  const [visibleCoins, setVisibleCoins] = useState<Map<string, Coin>>(new Map());
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [speed, setSpeedState] = useState(defaultSpeed);
  const [isPaused, setIsPaused] = useState(false);
  const runIdRef = useRef(0);
  const isPausedRef = useRef(false);

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  const runCode = async (code: string) => {
    if (isRunning) return;
    
    runIdRef.current += 1;
    const currentRunId = runIdRef.current;
    isPausedRef.current = false;
    setIsPaused(false);

    setIsRunning(true);
    setError(null);
    setLogs([]);
    
    let currentPos = { ...levelConfig.startPos, rotation: getInitialRotation(levelConfig.startPos.dir) };
    setPosition(currentPos);
    
    // Initialize game state using OOP
    const gameState = new GameState(levelConfig.coins);
    setScore(0);
    setVisibleCoins(gameState.visibleCoins);
    setIsSuccess(false);
    setMoveCount(0);
    
    let currentSpeed = defaultSpeed;
    setSpeedState(defaultSpeed);

    let transpiledCode = '';
    try {
      const result = Babel.transform(code, { presets: ['env'] });
      transpiledCode = result.code || '';
    } catch (err: any) {
      setError(`${t.babelError}: ${err.message}`);
      setIsRunning(false);
      return;
    }

    const walls = levelConfig.walls || [];
    const coins = levelConfig.coins || [];
    const pressurePlates = levelConfig.pressurePlates || [];

    const waitForPause = async () => {
      while (isPausedRef.current) {
        if (runIdRef.current !== currentRunId) throw new Error('aborted');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (runIdRef.current !== currentRunId) throw new Error('aborted');
    };

    const initFunc = (interpreter: any, globalObject: any) => {
      // Create Robot object
      const robotObj = interpreter.nativeToPseudo({});
      interpreter.setProperty(globalObject, 'Robot', robotObj);
      
      // Create Grid object
      const gridObj = interpreter.nativeToPseudo({});
      interpreter.setProperty(globalObject, 'Grid', gridObj);
      
      // Create Level object
      const levelObj = interpreter.nativeToPseudo({});
      interpreter.setProperty(globalObject, 'Level', levelObj);

      const availableCommands = apiConfigToCommands(levelConfig.availableCommands);
      
      // Robot methods
      if (availableCommands.includes('moveForward')) {
        interpreter.setProperty(robotObj, 'moveForward', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, currentSpeed));
            await waitForPause();

            gameState.incrementMoveCount();
            setMoveCount(gameState.moveCount);
            setLogs((prev: string[]) => [...prev, 'Robot.moveForward()']);
            
            let newX = currentPos.x;
            let newY = currentPos.y;
            if (currentPos.dir === 'N') newY -= 1;
            else if (currentPos.dir === 'E') newX += 1;
            else if (currentPos.dir === 'S') newY += 1;
            else if (currentPos.dir === 'W') newX -= 1;

            if (newX >= 0 && newX < levelConfig.gridSize && newY >= 0 && newY < levelConfig.gridSize) {
              if (walls.some(w => w.x === newX && w.y === newY)) {
                setError(t.hitWall);
                setIsRunning(false);
                return;
              }
              currentPos = { ...currentPos, x: newX, y: newY };
              setPosition(currentPos);
              
              // Check for coin collection using OOP
              const coinKey = CoinSystem.getCoinKey(newX, newY);
              const visibleCoin = gameState.visibleCoins.get(coinKey);
              
              if (visibleCoin) {
                const collected = gameState.collectCoin(visibleCoin);
                if (collected) {
                  setScore(gameState.score);
                  setVisibleCoins(new Map(gameState.visibleCoins));
                  const points = CoinSystem.getScore(visibleCoin.tier);
                  setLogs((prev: string[]) => [...prev, `Coin collected! +${points} points (Total: ${gameState.score})`]);
                  
                  // Play coin collection sound effect
                  audioManager.playSoundEffect('coinGet');
                }
              }
              
              // Check for pressure plate activation
              const plate = pressurePlates.find(p => p.x === newX && p.y === newY);
              if (plate) {
                const tierNames: Record<CoinTier, string> = { 1: 'Wood', 2: 'Silver', 3: 'Gold', 4: 'Diamond' };
                setLogs((prev: string[]) => [...prev, `${tierNames[plate.tier]} pressure plate activated! Resetting ${tierNames[plate.tier]} coins...`]);
                gameState.resetCoinsByTier(coins, plate.tier);
                setVisibleCoins(new Map(gameState.visibleCoins));
              }
            } else {
              setError(t.hitWall);
              setIsRunning(false);
              return;
            }
            
            callback();
            runLoop();
          } catch (e) {
            // aborted
          }
        }));
      }
      
      if (availableCommands.includes('turnLeft')) {
        interpreter.setProperty(robotObj, 'turnLeft', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, currentSpeed));
            await waitForPause();
            
            setLogs((prev: string[]) => [...prev, 'Robot.turnLeft()']);
            const dirs: Direction[] = ['N', 'W', 'S', 'E'];
            currentPos = { 
              ...currentPos, 
              dir: dirs[(dirs.indexOf(currentPos.dir) + 1) % 4],
              rotation: (currentPos.rotation ?? 0) - 90
            };
            setPosition(currentPos);
            
            callback();
            runLoop();
          } catch (e) {}
        }));
      }

      if (availableCommands.includes('turnRight')) {
        interpreter.setProperty(robotObj, 'turnRight', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, currentSpeed));
            await waitForPause();
            
            setLogs((prev: string[]) => [...prev, 'Robot.turnRight()']);
            const dirs: Direction[] = ['N', 'E', 'S', 'W'];
            currentPos = { 
              ...currentPos, 
              dir: dirs[(dirs.indexOf(currentPos.dir) + 1) % 4],
              rotation: (currentPos.rotation ?? 0) + 90
            };
            setPosition(currentPos);
            
            callback();
            runLoop();
          } catch (e) {}
        }));
      }

      // Robot properties (read-only getters)
      if (availableCommands.includes('robotX')) {
        Object.defineProperty(robotObj.properties, 'x', {
          get: () => interpreter.nativeToPseudo(currentPos.x),
          enumerable: true,
          configurable: false
        });
      }
      
      if (availableCommands.includes('robotY')) {
        Object.defineProperty(robotObj.properties, 'y', {
          get: () => interpreter.nativeToPseudo(currentPos.y),
          enumerable: true,
          configurable: false
        });
      }
      
      if (availableCommands.includes('robotDir')) {
        Object.defineProperty(robotObj.properties, 'direction', {
          get: () => interpreter.nativeToPseudo(currentPos.dir),
          enumerable: true,
          configurable: false
        });
      }
      
      if (availableCommands.includes('robotSpeed')) {
        // Speed is read-write, use a simple property that gets updated
        interpreter.setProperty(robotObj, 'speed', interpreter.nativeToPseudo(currentSpeed));
        
        // Override with getter/setter
        const speedDescriptor = {
          configurable: true,
          enumerable: true,
          get: interpreter.createNativeFunction(() => {
            return currentSpeed;
          }),
          set: interpreter.createNativeFunction((speed: number) => {
            currentSpeed = speed;
            setSpeedState(speed);
            setLogs((prev: string[]) => [...prev, `Robot.speed = ${speed}`]);
          })
        };
        
        interpreter.setProperty(robotObj, 'speed', speedDescriptor.get);
        
        // Intercept property writes
        Object.defineProperty(robotObj.properties, 'speed', {
          get: () => interpreter.nativeToPseudo(currentSpeed),
          set: (value: any) => {
            const nativeValue = interpreter.pseudoToNative(value);
            currentSpeed = nativeValue;
            setSpeedState(nativeValue);
            setLogs((prev: string[]) => [...prev, `Robot.speed = ${nativeValue}`]);
          },
          enumerable: true,
          configurable: true
        });
      }

      // Grid properties (read-only)
      if (availableCommands.includes('gridSize')) {
        interpreter.setProperty(gridObj, 'size',
          interpreter.nativeToPseudo(levelConfig.gridSize)
        );
      }
      
      if (availableCommands.includes('gridWalls')) {
        interpreter.setProperty(gridObj, 'walls',
          interpreter.nativeToPseudo(levelConfig.walls || [])
        );
      }
      
      if (availableCommands.includes('gridCoins')) {
        interpreter.setProperty(gridObj, 'coins',
          interpreter.nativeToPseudo(levelConfig.coins || [])
        );
      }
      
      if (availableCommands.includes('gridTarget')) {
        interpreter.setProperty(gridObj, 'target',
          interpreter.nativeToPseudo(levelConfig.targetPos)
        );
      }

      // Level properties (read-only)
      if (availableCommands.includes('requiredScore')) {
        Object.defineProperty(levelObj.properties, 'requiredScore', {
          get: () => interpreter.nativeToPseudo(levelConfig.victoryConditions?.requiredScore ?? 0),
          enumerable: true,
          configurable: false
        });
      }
      
      if (availableCommands.includes('maxMoves')) {
        Object.defineProperty(levelObj.properties, 'maxMoves', {
          get: () => interpreter.nativeToPseudo(levelConfig.victoryConditions?.maxMoves ?? -1),
          enumerable: true,
          configurable: false
        });
      }
      
      if (availableCommands.includes('currentScore')) {
        Object.defineProperty(levelObj.properties, 'score', {
          get: () => interpreter.nativeToPseudo(gameState.score),
          enumerable: true,
          configurable: false
        });
      }
      
      if (availableCommands.includes('currentMoves')) {
        Object.defineProperty(levelObj.properties, 'moves', {
          get: () => interpreter.nativeToPseudo(gameState.moveCount),
          enumerable: true,
          configurable: false
        });
      }

      // Console.log
      if (availableCommands.includes('log')) {
        const consoleObj = interpreter.nativeToPseudo({});
        interpreter.setProperty(globalObject, 'console', consoleObj);
        interpreter.setProperty(consoleObj, 'log', interpreter.createNativeFunction((...args: any[]) => {
          const str = args.map(arg => {
            try {
              const nativeArg = interpreter.pseudoToNative(arg);
              return typeof nativeArg === 'object' ? JSON.stringify(nativeArg) : String(nativeArg);
            } catch (e) {
              return String(arg);
            }
          }).join(' ');
          setLogs((prev: string[]) => [...prev, str]);
        }));
      }
    };

    let myInterpreter: any;
    try {
      myInterpreter = new Interpreter(transpiledCode, initFunc);
    } catch (err: any) {
      setError(`${t.execError}: ${err.message}`);
      setIsRunning(false);
      return;
    }

    let steps = 0;
    const MAX_STEPS = 100000;

    const runLoop = () => {
      if (runIdRef.current !== currentRunId) return;
      
      try {
        let batchSteps = 0;
        while (true) {
          steps++;
          batchSteps++;
          if (steps > MAX_STEPS) {
            throw new Error(t.infiniteLoop);
          }
          
          const status = myInterpreter.getStatus();
          
          if (status === 0) { // DONE
            checkVictory();
            return;
          }
          
          if (status === 2) { // TASK (waiting for setTimeout)
            setTimeout(runLoop, 10);
            return;
          }
          
          if (status === 3 || myInterpreter.paused_) { // ASYNC
            return; // Paused by async, wait for callback
          }

          myInterpreter.step();
          
          if (batchSteps > 1000) {
            setTimeout(runLoop, 0);
            return;
          }
        }
      } catch (err: any) {
        setError(`${t.execError}: ${err.message}`);
        setIsRunning(false);
      }
    };

    const checkVictory = () => {
      if (runIdRef.current !== currentRunId) return;
      
      if (currentPos.x === levelConfig.targetPos.x && currentPos.y === levelConfig.targetPos.y) {
        const conditions = levelConfig.victoryConditions || {};
        const requiredScore = conditions.requiredScore ?? 0;
        const maxMoves = conditions.maxMoves;

        if (gameState.score < requiredScore) {
          setError(`${t.missedCoins || 'Not enough score!'} (Score: ${gameState.score}/${requiredScore})`);
        } else if (maxMoves !== undefined && gameState.moveCount > maxMoves) {
          setError(`${t.tooManyMoves} (Used: ${gameState.moveCount}, Max: ${maxMoves})`);
        } else {
          setIsSuccess(true);
          onSuccess();
        }
      }
      
      setIsRunning(false);
    };

    // Start execution
    runLoop();
  };

  const reset = () => {
    runIdRef.current += 1;
    isPausedRef.current = false;
    setIsPaused(false);
    setPosition({ ...levelConfig.startPos, rotation: getInitialRotation(levelConfig.startPos.dir) });
    setScore(0);
    const gameState = new GameState(levelConfig.coins);
    setVisibleCoins(gameState.visibleCoins);
    setLogs([]);
    setError(null);
    setIsSuccess(false);
    setIsRunning(false);
    setMoveCount(0);
    setSpeedState(defaultSpeed);
  };

  const forceReset = (newConfig: LevelConfig) => {
    runIdRef.current += 1;
    isPausedRef.current = false;
    setIsPaused(false);
    setPosition({ ...newConfig.startPos, rotation: getInitialRotation(newConfig.startPos.dir) });
    setScore(0);
    const gameState = new GameState(newConfig.coins);
    setVisibleCoins(gameState.visibleCoins);
    setLogs([]);
    setError(null);
    setIsSuccess(false);
    setIsRunning(false);
    setMoveCount(0);
    setSpeedState(defaultSpeed);
  };

  return { position, score, visibleCoins, logs, error, isRunning, isPaused, isSuccess, runCode, togglePause, reset, forceReset, moveCount, speed };
}

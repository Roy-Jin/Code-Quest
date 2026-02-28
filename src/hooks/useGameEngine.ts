import { useState, useRef } from 'react';
import * as Babel from '@babel/standalone';
// @ts-ignore
import Interpreter from 'js-interpreter';
import { Position, LevelConfig, Direction } from '../types';

interface Action {
  type: string;
  payload?: any;
}

const getInitialRotation = (dir: Direction) => {
  if (dir === 'N') return 0;
  if (dir === 'E') return 90;
  if (dir === 'S') return 180;
  if (dir === 'W') return 270;
  return 0;
};

export function useGameEngine(levelConfig: LevelConfig, t: any, onSuccess: () => void) {
  const [position, setPosition] = useState<Position>({ ...levelConfig.startPos, rotation: getInitialRotation(levelConfig.startPos.dir) });
  const [collectedCoins, setCollectedCoins] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [speed, setSpeedState] = useState(400);
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
    
    let currentCollected: string[] = [];
    setCollectedCoins([]);
    
    setIsSuccess(false);
    
    let currentMoveCount = 0;
    setMoveCount(0);
    
    let currentSpeed = 400;
    setSpeedState(400);

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

    const waitForPause = async () => {
      while (isPausedRef.current) {
        if (runIdRef.current !== currentRunId) throw new Error('aborted');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (runIdRef.current !== currentRunId) throw new Error('aborted');
    };

    const initFunc = (interpreter: any, globalObject: any) => {
      if (levelConfig.availableCommands.includes('moveForward')) {
        interpreter.setProperty(globalObject, 'moveForward', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, currentSpeed));
            await waitForPause();

            currentMoveCount++;
            setMoveCount(currentMoveCount);
            setLogs(prev => [...prev, 'moveForward()']);
            
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
      
      if (levelConfig.availableCommands.includes('turnLeft')) {
        interpreter.setProperty(globalObject, 'turnLeft', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, currentSpeed));
            await waitForPause();
            
            setLogs(prev => [...prev, 'turnLeft()']);
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

      if (levelConfig.availableCommands.includes('turnRight')) {
        interpreter.setProperty(globalObject, 'turnRight', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, currentSpeed));
            await waitForPause();
            
            setLogs(prev => [...prev, 'turnRight()']);
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

      if (levelConfig.availableCommands.includes('collectCoin')) {
        interpreter.setProperty(globalObject, 'collectCoin', interpreter.createAsyncFunction(async (callback: any) => {
          try {
            await waitForPause();
            await new Promise(resolve => setTimeout(resolve, Math.min(currentSpeed / 2, 100)));
            await waitForPause();
            
            setLogs(prev => [...prev, 'collectCoin()']);
            const coinExists = coins.some(c => c.x === currentPos.x && c.y === currentPos.y);
            const coinKey = `${currentPos.x},${currentPos.y}`;
            if (coinExists && !currentCollected.includes(coinKey)) {
              currentCollected = [...currentCollected, coinKey];
              setCollectedCoins(currentCollected);
            } else {
              setLogs(prev => [...prev, t.noCoin || 'No coin here']);
            }
            
            callback();
            runLoop();
          } catch (e) {}
        }));
      }

      if (levelConfig.availableCommands.includes('log')) {
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
          setLogs(prev => [...prev, str]);
        }));
      }

      if (levelConfig.availableCommands.includes('getGrid')) {
        interpreter.setProperty(globalObject, 'getGrid', interpreter.createNativeFunction(() => {
          return interpreter.nativeToPseudo({
            size: levelConfig.gridSize,
            walls: levelConfig.walls,
            coins: levelConfig.coins,
            targetPos: levelConfig.targetPos,
            startPos: levelConfig.startPos
          });
        }));
      }

      if (levelConfig.availableCommands.includes('getRobotState')) {
        interpreter.setProperty(globalObject, 'getRobotState', interpreter.createNativeFunction(() => {
          return interpreter.nativeToPseudo({ x: currentPos.x, y: currentPos.y, dir: currentPos.dir });
        }));
      }

      if (levelConfig.availableCommands.includes('getObjectives')) {
        interpreter.setProperty(globalObject, 'getObjectives', interpreter.createNativeFunction(() => {
          return interpreter.nativeToPseudo({
            requiredCoins: levelConfig.victoryConditions?.requiredCoins ?? levelConfig.coins.length,
            maxMoves: levelConfig.victoryConditions?.maxMoves ?? -1
          });
        }));
      }

      if (levelConfig.availableCommands.includes('getCurrentState')) {
        interpreter.setProperty(globalObject, 'getCurrentState', interpreter.createNativeFunction(() => {
          return interpreter.nativeToPseudo({ collectedCoins: currentCollected.length, moves: currentMoveCount });
        }));
      }

      if (levelConfig.availableCommands.includes('setSpeed')) {
        interpreter.setProperty(globalObject, 'setSpeed', interpreter.createNativeFunction((speed: number) => {
          currentSpeed = speed;
          setSpeedState(speed);
          setLogs(prev => [...prev, `setSpeed(${speed})`]);
        }));
      }

      if (levelConfig.availableCommands.includes('getSpeed')) {
        interpreter.setProperty(globalObject, 'getSpeed', interpreter.createNativeFunction(() => {
          return currentSpeed;
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
        const requiredCoins = conditions.requiredCoins ?? coins.length;
        const maxMoves = conditions.maxMoves;

        if (currentCollected.length < requiredCoins) {
          setError(t.missedCoins);
        } else if (maxMoves !== undefined && currentMoveCount > maxMoves) {
          setError(`${t.tooManyMoves} (Used: ${currentMoveCount}, Max: ${maxMoves})`);
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
    setCollectedCoins([]);
    setLogs([]);
    setError(null);
    setIsSuccess(false);
    setIsRunning(false);
    setMoveCount(0);
    setSpeedState(400);
  };

  const forceReset = (newConfig: LevelConfig) => {
    runIdRef.current += 1;
    isPausedRef.current = false;
    setIsPaused(false);
    setPosition({ ...newConfig.startPos, rotation: getInitialRotation(newConfig.startPos.dir) });
    setCollectedCoins([]);
    setLogs([]);
    setError(null);
    setIsSuccess(false);
    setIsRunning(false);
    setMoveCount(0);
    setSpeedState(400);
  };

  return { position, collectedCoins, logs, error, isRunning, isPaused, isSuccess, runCode, togglePause, reset, forceReset, moveCount, speed };
}

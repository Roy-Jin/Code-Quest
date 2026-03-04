# Code Quest - 命令参考

本文档提供了 Code Quest 中所有可用命令和属性的综合参考。

## 目录

- [机器人命令](#机器人命令)
- [机器人属性](#机器人属性)
- [网格属性](#网格属性)
- [关卡属性](#关卡属性)
- [控制台命令](#控制台命令)

## 机器人命令

| 命令 | 描述 | 使用方法 |
|------|------|----------|
| `moveForward()` | 向前移动一步。 | `Robot.moveForward()` |
| `turnLeft()` | 向左转90度。 | `Robot.turnLeft()` |
| `turnRight()` | 向右转90度。 | `Robot.turnRight()` |

## 机器人属性

| 属性 | 类型 | 描述 | 使用方法 |
|------|------|------|----------|
| `x` | `number` | 机器人X坐标（只读）。 | `Robot.x` |
| `y` | `number` | 机器人Y坐标（只读）。 | `Robot.y` |
| `direction` | `"N" \| "E" \| "S" \| "W"` | 机器人方向：N, E, S, W（只读）。 | `Robot.direction` |
| `speed` | `number` | 动画速度（毫秒）（可读写）。 | `Robot.speed = 100;` |

## 网格属性

| 属性 | 类型 | 描述 | 使用方法 |
|------|------|------|----------|
| `size` | `number` | 网格大小（只读）。 | `Grid.size` |
| `walls` | `{ x: number; y: number }[]` | 墙壁位置数组（只读）。 | `Grid.walls` |
| `coins` | `{ x: number; y: number; tier: number }[]` | 金币位置和等级数组（只读）。 | `Grid.coins` |
| `target` | `{ x: number; y: number }` | 目标位置（只读）。 | `Grid.target` |

## 关卡属性

| 属性 | 类型 | 描述 | 使用方法 |
|------|------|------|----------|
| `requiredScore` | `number` | 获胜所需分数（只读）。 | `Level.requiredScore` |
| `maxMoves` | `number` | 最大允许步数（只读）。 | `Level.maxMoves` |
| `score` | `number` | 当前分数（只读）。 | `Level.score` |
| `moves` | `number` | 当前步数（只读）。 | `Level.moves` |

## 控制台命令

| 命令 | 描述 | 使用方法 |
|------|------|----------|
| `log(msg)` | 在控制台打印一条消息。 | `console.log("你好，世界！");` |

## 使用示例

```javascript
// 向前移动3次
for (let i = 0; i < 3; i++) {
  Robot.moveForward();
}

// 向右转并移动
Robot.turnRight();
Robot.moveForward();

// 检查当前位置
console.log(`当前位置: (${Robot.x}, ${Robot.y})`);
console.log(`当前方向: ${Robot.direction}`);

// 检查关卡状态
console.log(`分数: ${Level.score}/${Level.requiredScore}`);
console.log(`步数: ${Level.moves}/${Level.maxMoves}`);

// 调整动画速度
Robot.speed = 200; // 更快
```
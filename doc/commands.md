# Code Quest - Command Reference

This document provides a comprehensive reference for all available commands and properties in Code Quest.

## Table of Contents

- [Robot Commands](#robot-commands)
- [Robot Properties](#robot-properties)
- [Grid Properties](#grid-properties)
- [Level Properties](#level-properties)
- [Console Commands](#console-commands)

## Robot Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `moveForward()` | Moves the robot forward one step. | `Robot.moveForward()` |
| `turnLeft()` | Turns the robot 90 degrees to the left. | `Robot.turnLeft()` |
| `turnRight()` | Turns the robot 90 degrees to the right. | `Robot.turnRight()` |

## Robot Properties

| Property | Type | Description | Usage |
|----------|------|-------------|-------|
| `x` | `number` | Robot X coordinate (read-only). | `Robot.x` |
| `y` | `number` | Robot Y coordinate (read-only). | `Robot.y` |
| `direction` | `"N" \| "E" \| "S" \| "W"` | Robot direction: N, E, S, W (read-only). | `Robot.direction` |
| `speed` | `number` | Animation speed in milliseconds (read/write). | `Robot.speed = 100;` |

## Grid Properties

| Property | Type | Description | Usage |
|----------|------|-------------|-------|
| `size` | `number` | Grid size (read-only). | `Grid.size` |
| `walls` | `{ x: number; y: number }[]` | Array of wall positions (read-only). | `Grid.walls` |
| `coins` | `{ x: number; y: number; tier: number }[]` | Array of coin positions and tiers (read-only). | `Grid.coins` |
| `target` | `{ x: number; y: number }` | Target position (read-only). | `Grid.target` |

## Level Properties

| Property | Type | Description | Usage |
|----------|------|-------------|-------|
| `requiredScore` | `number` | Required score to win (read-only). | `Level.requiredScore` |
| `maxMoves` | `number` | Maximum allowed moves (read-only). | `Level.maxMoves` |
| `score` | `number` | Current score (read-only). | `Level.score` |
| `moves` | `number` | Current move count (read-only). | `Level.moves` |

## Console Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `log(msg)` | Prints a message to the console. | `console.log("Hello, World!");` |

## Example Usage

```javascript
// Move forward 3 times
for (let i = 0; i < 3; i++) {
  Robot.moveForward();
}

// Turn right and move
Robot.turnRight();
Robot.moveForward();

// Check current position
console.log(`Current position: (${Robot.x}, ${Robot.y})`);
console.log(`Current direction: ${Robot.direction}`);

// Check level status
console.log(`Score: ${Level.score}/${Level.requiredScore}`);
console.log(`Moves: ${Level.moves}/${Level.maxMoves}`);

// Adjust animation speed
Robot.speed = 200; // Faster
```
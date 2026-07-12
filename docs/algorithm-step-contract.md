# Algorithm Step Generator Contract

## Overview

Every algorithm visualizer in AlgoBuddy is powered by a **step generator** — a JavaScript generator function that yields a sequence of step objects. The visualizer engine consumes these steps to drive animations and state changes.

## Step Object Schema

Each yielded step object must follow this shape:

```typescript
{
  type: "start" | "complete" | "step" | "error" | "highlight",
  // The type of step — determines how the engine processes it

  operation?: string,
  // Human-readable label (e.g., "Comparing elements", "Swapping values")

  description?: string,
  // Detailed explanation shown in the info panel

  data?: object,
  // Arbitrary data payload passed to the renderer

  highlight?: number[],
  // Array of indices to highlight in the visualization

  message?: string,
  // Message displayed to the user (on errors or completion)

  stack?: any[],
  // New stack state (for Stack visualizers)

  queue?: any[],
  // New queue state (for Queue visualizers)

  array?: any[],
  // New array state (for Sorting visualizers)

  list?: object,
  // New linked list state (for Linked List visualizers)

  tree?: object,
  // New tree state (for Tree visualizers)

  comparisons?: number,
  // Running comparison count (for complexity analysis)

  swaps?: number,
  // Running swap count (for complexity analysis)
}
```

## Step Types

### `start`
Marks the beginning of an algorithm execution.

```javascript
yield { type: "start" };
```

### `step`
A single algorithmic step — drives the animation forward.

```javascript
yield {
  type: "step",
  operation: "Comparing elements at indices 2 and 5",
  data: { array: [1, 3, 2, 5, 4], highlight: [2, 5] },
  comparisons: 3
};
```

### `highlight`
Highlights specific elements without changing state.

```javascript
yield {
  type: "highlight",
  highlight: [0, 1],
  description: "These elements are being compared"
};
```

### `complete`
Signals the end of algorithm execution.

```javascript
yield {
  type: "complete",
  message: "Array sorted in 12 comparisons",
  stack: finalStack,
  comparisons: 12,
  swaps: 5
};
```

### `error`
Reports an error during execution.

```javascript
yield {
  type: "error",
  message: "Stack is full — cannot push more elements"
};
```

## Generator Pattern

All algorithm generators follow this pattern:

```javascript
export function* algorithmName(input, ...args) {
  yield { type: "start" };

  // Validate input
  if (!input || input.length === 0) {
    yield { type: "error", message: "Input cannot be empty" };
    return;
  }

  // Algorithm logic with steps
  for (let i = 0; i < input.length; i++) {
    // ... algorithm logic ...
    yield {
      type: "step",
      operation: "Processing element " + i,
      data: { currentValue: input[i] },
      highlight: [i],
      comparisons: comparisonCount,
    };
  }

  yield { type: "complete", message: "Done!" };
}
```

## Adding a New Algorithm

1. Create a new file in `src/features/algorithms/<category>/`
2. Export a generator function following the contract above
3. Register the algorithm in `src/config/algorithms.js`
4. Create a visualizer component in `src/app/components/visualizer/`

## Existing Algorithm Categories

| Directory | Visualizers |
|-----------|-------------|
| `sorting/` | Bubble, Selection, Insertion, Merge, Quick |
| `searching/` | Linear, Binary |
| `stack/` | Push, Pop, Peek |
| `queue/` | Enqueue, Dequeue, Circular, Priority |
| `linkedlist/` | Singly, Doubly, Circular |
| `tree/` | BST, Heap, Trie |
| `hashmap/` | Insert, Search, Delete |

## Best Practices

1. **Yield early, yield often** — More granular steps produce smoother animations
2. **Track comparisons and swaps** — Enables complexity analysis
3. **Validate input first** — Yield an error step for invalid input
4. **Keep messages concise** — Users see these in the info panel
5. **Use descriptive operation names** — Helps users understand what's happening

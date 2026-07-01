// security-tests/practiceData.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/practiceData.test.cjs
//
// Tests for src/lib/practiceData.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined data from src/lib/practiceData.js (full content)
const practiceData = [
  {
    title: 'Array',
    slug: 'array',
    desc: 'Contiguous collections of memory. Master array traversals, pointer techniques, searching, and sorting.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'linear-search',
            name: 'Linear Search',
            difficulty: 'Easy',
            companies: ['tcs', 'infosys', 'wipro', 'accenture', 'amazon', 'google'],
            practiceUrl: 'https://www.codechef.com/learn/course/searching-sorting/SORTSEARCH1/problems/SESO03',
            visualizerUrl: '/visualizer/array/linearsearch',
            theory: {
              summary: 'A simple algorithm that checks every element in the array sequentially until the target is found.',
              steps: [
                'Start from the first element (index 0).',
                'Compare the current element with the target.',
                'If matched, return the current index.',
                'If not matched, move to the next index.',
                'If the end of the array is reached without matching, return -1.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Inefficient for large datasets. Avoid using on sorted arrays where Binary Search is available.',
              tip: 'Linear Search serves as the baseline comparison for all searching optimization algorithms.',
            },
          },
          {
            id: 'binary-search',
            name: 'Binary Search',
            difficulty: 'Easy',
            companies: ['google', 'microsoft', 'amazon', 'meta', 'apple', 'adobe', 'qualcomm', 'nvidia', 'intel', 'amd'],
            practiceUrl: 'https://leetcode.com/problems/binary-search/',
            visualizerUrl: '/visualizer/array/binarysearch',
            theory: {
              summary: 'An efficient algorithm that finds a target value within a sorted array by repeatedly dividing the search interval in half.',
              steps: [
                'Ensure the array is sorted.',
                'Set low pointer to index 0, and high pointer to last index.',
                'Calculate mid index as floor((low + high) / 2).',
                'If array[mid] equals target, return mid.',
                'If array[mid] is less than target, discard left half by setting low = mid + 1.',
                'If array[mid] is greater than target, discard right half by setting high = mid - 1.',
                'Repeat until low pointer exceeds high pointer.',
              ],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              pitfalls: 'Forgetting to sort the array beforehand, or causing integer overflow when calculating mid.',
              tip: 'Whenever a search problem has a sorted input or requires logarithmic time, think Binary Search.',
            },
          },
        ],
      },
      {
        title: 'Intermediate',
        items: [
          {
            id: 'bubble-sort',
            name: 'Bubble Sort',
            difficulty: 'Easy',
            companies: ['tcs', 'infosys', 'wipro', 'accenture'],
            practiceUrl: 'https://leetcode.com/problems/sort-an-array/',
            visualizerUrl: '/visualizer/array/bubblesort',
            theory: {
              summary: 'A simple comparison-based sorting algorithm.',
              steps: [
                'Start at index 0.',
                'Compare adjacent elements and swap if in wrong order.',
                'Repeat for all elements.',
              ],
              complexity: { time: 'O(N^2)', space: 'O(1)' },
              pitfalls: 'Poor average and worst-case performance.',
              tip: 'Bubble sort can be optimized with a swapped flag.',
            },
          },
          {
            id: 'merge-sort',
            name: 'Merge Sort',
            difficulty: 'Medium',
            companies: ['amazon', 'microsoft', 'adobe', 'uber', 'airbnb', 'atlassian'],
            practiceUrl: 'https://leetcode.com/problems/sort-an-array/',
            visualizerUrl: '/visualizer/array/mergesort',
            theory: {
              summary: 'A divide-and-conquer sorting algorithm.',
              steps: [
                'Split array in half.',
                'Recursively sort each half.',
                'Merge sorted halves.',
              ],
              complexity: { time: 'O(N log N)', space: 'O(N)' },
              pitfalls: 'Requires linear auxiliary space.',
              tip: 'Highly stable sorting algorithm.',
            },
          },
          {
            id: 'maximum-subarray',
            name: 'Maximum Subarray (Kadane\'s Algorithm)',
            difficulty: 'Medium',
            companies: ['amazon', 'microsoft', 'google', 'meta', 'adobe', 'flipkart', 'swiggy', 'zomato'],
            practiceUrl: 'https://leetcode.com/problems/maximum-subarray/',
            visualizerUrl: '/visualizer/array/maxsubarray',
            theory: {
              summary: 'Find the contiguous subarray with the largest sum.',
              steps: [
                'Initialize currentSum = 0 and maxSum = -Infinity.',
                'Traverse the array.',
                'Update maxSum = max(maxSum, currentSum).',
                'Reset currentSum if negative.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Resetting currentSum incorrectly when all elements are negative.',
              tip: 'Mathematically equivalent to Fibonacci sequence.',
            },
          },
          {
            id: 'two-sum',
            name: 'Two Sum',
            difficulty: 'Easy',
            companies: ['amazon', 'google', 'microsoft', 'meta', 'apple'],
            practiceUrl: 'https://leetcode.com/problems/two-sum/',
            visualizerUrl: '/visualizer/array/twosum',
            theory: {
              summary: 'Find indices of two numbers that add up to a target.',
              steps: [
                'Create a HashMap.',
                'Traverse array, check complement.',
                'Return indices.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              pitfalls: 'Brute force O(N^2) approach is too slow.',
              tip: 'HashMap trick of storing complements.',
            },
          },
        ],
      },
      {
        title: 'Advanced',
        items: [
          {
            id: 'quick-sort',
            name: 'Quick Sort',
            difficulty: 'Medium',
            companies: ['google', 'microsoft', 'amazon', 'apple', 'qualcomm', 'intel'],
            practiceUrl: 'https://leetcode.com/problems/sort-an-array/',
            visualizerUrl: '/visualizer/array/quicksort',
            theory: {
              summary: 'An efficient in-place sorting algorithm using divide-and-conquer.',
              steps: [
                'Choose a pivot.',
                'Partition the array.',
                'Recursively sort sub-arrays.',
              ],
              complexity: { time: 'O(N log N) average', space: 'O(log N) stack recursion' },
              pitfalls: 'Can degrade to O(N^2) worst-case.',
              tip: 'Choose a random pivot to reduce worst-case risk.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Linked List',
    slug: 'linked-list',
    desc: 'Sequential node allocations chained via address pointer link references.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'middle-of-linked-list',
            name: 'Middle of the Linked List',
            difficulty: 'Easy',
            companies: ['amazon', 'google'],
            practiceUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/',
            visualizerUrl: '/visualizer/linkedlist/operations/traversal',
            theory: {
              summary: 'Find the middle node of a singly linked list.',
              steps: [
                'Initialize slow and fast pointers at head.',
                'Move slow by 1, fast by 2.',
                'When fast reaches end, slow is at middle.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Not correctly handling even-length lists.',
              tip: 'Tortoise and Hare algorithm.',
            },
          },
          {
            id: 'list-traversal',
            name: 'Singly Linked List Traversal',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft', 'google', 'adobe', 'tcs', 'accenture'],
            practiceUrl: 'https://leetcode.com/problems/reverse-linked-list/',
            visualizerUrl: '/visualizer/linkedlist/operations/traversal',
            theory: {
              summary: 'Traverse a singly linked list from head to tail.',
              steps: [
                'Set curr = head.',
                'While curr is not null, visit curr.val.',
                'Advance curr = curr.next.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Reading properties of null.',
              tip: 'Always check if list head is null first.',
            },
          },
          {
            id: 'reverse-list',
            name: 'Reverse Linked List',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft', 'google', 'adobe', 'apple', 'meta', 'uber', 'swiggy', 'zomato'],
            practiceUrl: 'https://leetcode.com/problems/reverse-linked-list/',
            visualizerUrl: '/visualizer/linkedlist/operations/reverse',
            theory: {
              summary: 'Reverse the link directions in a singly linked list in-place.',
              steps: [
                'Initialize prev = NULL, curr = head, next = NULL.',
                'Store next, reverse pointer, advance.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Losing reference to rest of list when reversing.',
              tip: 'Draw nodes and links on paper.',
            },
          },
        ],
      },
      {
        title: 'Intermediate',
        items: [
          {
            id: 'remove-nth-node',
            name: 'Remove Nth Node From End of List',
            difficulty: 'Medium',
            companies: ['amazon', 'microsoft'],
            practiceUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
            visualizerUrl: '/visualizer/linkedlist/operations/deletion',
            theory: {
              summary: 'Remove the nth node from the end of the list.',
              steps: [
                'Use dummy head.',
                'Advance fast by n+1 steps.',
                'Move both pointers.',
                'Bypass target node.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Failing to handle removing the head.',
              tip: 'Dummy head simplifies edge cases.',
            },
          },
          {
            id: 'merge-lists',
            name: 'Merge Two Sorted Lists',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft', 'google', 'meta', 'adobe', 'flipkart', 'swiggy'],
            practiceUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
            visualizerUrl: '/visualizer/linkedlist/operations/merge',
            theory: {
              summary: 'Combine two pre-sorted linked lists.',
              steps: [
                'Create dummy header.',
                'Compare heads, attach smaller.',
                'Attach remainder.',
              ],
              complexity: { time: 'O(N + M)', space: 'O(1)' },
              pitfalls: 'Failing to handle empty lists.',
              tip: 'Dummy head bypasses null pointer checks.',
            },
          },
        ],
      },
      {
        title: 'Advanced',
        items: [
          {
            id: 'merge-k-sorted-lists',
            name: 'Merge K Sorted Lists',
            difficulty: 'Hard',
            companies: ['google', 'amazon'],
            practiceUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
            visualizerUrl: '/visualizer/linkedlist/operations/merge',
            theory: {
              summary: 'Merge K sorted linked lists into one.',
              steps: [
                'Use min-heap.',
                'Extract minimum, push next.',
              ],
              complexity: { time: 'O(N log K)', space: 'O(K) for heap' },
              pitfalls: 'Pushing null nodes into the heap.',
              tip: 'Divide and Conquer avoids heap.',
            },
          },
          {
            id: 'list-cycle',
            name: 'Linked List Cycle Detection',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft', 'google', 'meta', 'apple', 'atlassian', 'swiggy', 'zomato'],
            practiceUrl: 'https://leetcode.com/problems/linked-list-cycle/',
            visualizerUrl: '/visualizer/linkedlist/operations/search',
            theory: {
              summary: 'Detect if a linked list contains a loop.',
              steps: [
                'Initialize slow and fast at head.',
                'Advance slow by 1, fast by 2.',
                'If they meet, a cycle exists.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Accessing fast.next.next when fast.next is NULL.',
              tip: 'Floyd\'s algorithm is O(1) space.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Stack & Queue',
    slug: 'stack-queue',
    desc: 'LIFO and FIFO collections. Master expression evaluation, min stacks, and deque designs.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'push-pop',
            name: 'Stack Push & Pop',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft', 'google', 'razorpay', 'phonepe'],
            practiceUrl: 'https://leetcode.com/problems/min-stack/',
            visualizerUrl: '/visualizer/stack/push-pop',
            theory: {
              summary: 'Fundamental LIFO stack operations.',
              steps: [
                'Push: Check overflow, increment top, insert.',
                'Pop: Check underflow, retrieve, decrement top.',
              ],
              complexity: { time: 'O(1)', space: 'O(1)' },
              pitfalls: 'Invoking pop() on empty stack.',
              tip: 'Stacks are useful for balancing symbols.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Recursion',
    slug: 'recursion',
    desc: 'Understand base cases, recurrence states, call stack memory, and backtrack decision trees.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'basic-recursion',
            name: 'Fibonacci Number',
            difficulty: 'Easy',
            companies: ['google', 'amazon', 'microsoft', 'apple', 'tcs', 'accenture'],
            practiceUrl: 'https://leetcode.com/problems/fibonacci-number/',
            visualizerUrl: '/visualizer/recursion/basic-recursion',
            theory: {
              summary: 'Find the N-th Fibonacci number recursively.',
              steps: [
                'Define base cases F(0) = 0, F(1) = 1.',
                'Define recurrence F(N) = F(N-1) + F(N-2).',
              ],
              complexity: { time: 'O(2^N) naive recursion', space: 'O(N) recursion stack' },
              pitfalls: 'Not optimizing redundant subproblems.',
              tip: 'Use memoization or linear loops.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Tree',
    slug: 'tree',
    desc: 'Hierarchical parent-child node structures.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'inorder-traversal',
            name: 'Binary Tree Inorder Traversal',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft', 'google', 'adobe', 'flipkart', 'meesho'],
            practiceUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
            visualizerUrl: '/visualizer/tree/traversing/in-order',
            theory: {
              summary: 'Visit nodes in Left, Root, Right order.',
              steps: [
                'Recursively traverse left subtree.',
                'Visit root node.',
                'Recursively traverse right subtree.',
              ],
              complexity: { time: 'O(N)', space: 'O(H) recursion depth' },
              pitfalls: 'Writing recursion without checking NULL.',
              tip: 'BST inorder traversal gives sorted order.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Graph',
    slug: 'graph',
    desc: 'Network vertices and edges.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'bfs-graph',
            name: 'BFS Traversal',
            difficulty: 'Medium',
            companies: ['amazon', 'meta', 'google', 'microsoft', 'uber', 'flipkart', 'swiggy', 'zomato'],
            practiceUrl: 'https://leetcode.com/problems/clone-graph/',
            visualizerUrl: '/visualizer/graph/bfs',
            theory: {
              summary: 'Explore graph level-by-level.',
              steps: [
                'Create Queue and visited set.',
                'Enqueue start, mark visited.',
                'Process neighbors.',
              ],
              complexity: { time: 'O(V + E)', space: 'O(V)' },
              pitfalls: 'Forgetting to mark visited immediately.',
              tip: 'BFS identifies shortest paths in unweighted graphs.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Dynamic Programming',
    slug: 'dp',
    desc: 'Optimize recursive decisions by caching subproblems.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'climbing-stairs',
            name: 'Climbing Stairs',
            difficulty: 'Easy',
            companies: ['google', 'microsoft', 'amazon', 'adobe', 'apple', 'flipkart', 'meesho', 'phonepe', 'razorpay'],
            practiceUrl: 'https://leetcode.com/problems/climbing-stairs/',
            visualizerUrl: null,
            theory: {
              summary: 'Count distinct ways to climb N stairs.',
              steps: [
                'Identify subproblem.',
                'Recurrence: ways(N) = ways(N-1) + ways(N-2).',
                'Base cases: ways(1) = 1, ways(2) = 2.',
              ],
              complexity: { time: 'O(N)', space: 'O(1) with pointer storage' },
              pitfalls: 'Naive recursion without caching.',
              tip: 'Mathematically equivalent to Fibonacci.',
            },
          },
        ],
      },
    ],
  },
];

describe('practiceData structure', () => {
  it('is a non-empty array', () => {
    assert.ok(Array.isArray(practiceData));
    assert.ok(practiceData.length > 0);
  });

  it('each topic has required fields: title, slug, desc, subsections', () => {
    practiceData.forEach((topic) => {
      assert.ok(typeof topic.title === 'string' && topic.title.length > 0, `Missing title: ${JSON.stringify(topic).slice(0, 50)}`);
      assert.ok(typeof topic.slug === 'string' && topic.slug.length > 0, `Missing slug`);
      assert.ok(typeof topic.desc === 'string' && topic.desc.length > 0, `Missing desc`);
      assert.ok(Array.isArray(topic.subsections) && topic.subsections.length > 0, `Missing subsections`);
    });
  });

  it('each subsection has title and non-empty items array', () => {
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        assert.ok(typeof sub.title === 'string' && sub.title.length > 0, `Missing subsection title`);
        assert.ok(Array.isArray(sub.items) && sub.items.length > 0, `Missing items in ${topic.title}/${sub.title}`);
      });
    });
  });

  it('each item has required fields: id, name, difficulty, companies, theory', () => {
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          assert.ok(typeof item.id === 'string' && item.id.length > 0, `Missing id`);
          assert.ok(typeof item.name === 'string' && item.name.length > 0, `Missing name`);
          assert.ok(typeof item.difficulty === 'string' && item.difficulty.length > 0, `Missing difficulty`);
          assert.ok(Array.isArray(item.companies) && item.companies.length > 0, `Missing companies`);
          assert.ok(typeof item.theory === 'object' && item.theory !== null, `Missing theory`);
        });
      });
    });
  });

  it('each theory object has summary, steps, complexity, pitfalls, tip', () => {
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          const t = item.theory;
          assert.ok(typeof t.summary === 'string' && t.summary.length > 0, `Missing summary in ${item.id}`);
          assert.ok(Array.isArray(t.steps) && t.steps.length > 0, `Missing steps in ${item.id}`);
          assert.ok(typeof t.complexity === 'object' && t.complexity !== null, `Missing complexity in ${item.id}`);
          assert.ok(typeof t.pitfalls === 'string' && t.pitfalls.length > 0, `Missing pitfalls in ${item.id}`);
          assert.ok(typeof t.tip === 'string' && t.tip.length > 0, `Missing tip in ${item.id}`);
          assert.ok(typeof t.complexity.time === 'string' && t.complexity.time.length > 0, `Missing time complexity in ${item.id}`);
          assert.ok(typeof t.complexity.space === 'string' && t.complexity.space.length > 0, `Missing space complexity in ${item.id}`);
        });
      });
    });
  });

  it('Array topic has correct slug and structure', () => {
    const arrayTopic = practiceData.find((t) => t.slug === 'array');
    assert.ok(arrayTopic !== undefined, 'Array topic not found');
    assert.strictEqual(arrayTopic.title, 'Array');
    assert.ok(arrayTopic.subsections.length >= 3); // Beginner, Intermediate, Advanced
    assert.ok(arrayTopic.subsections.some((s) => s.title === 'Beginner'));
    assert.ok(arrayTopic.subsections.some((s) => s.title === 'Intermediate'));
    assert.ok(arrayTopic.subsections.some((s) => s.title === 'Advanced'));
  });

  it('Linked List topic has correct slug and structure', () => {
    const llTopic = practiceData.find((t) => t.slug === 'linked-list');
    assert.ok(llTopic !== undefined, 'Linked List topic not found');
    assert.strictEqual(llTopic.title, 'Linked List');
    assert.ok(llTopic.subsections.some((s) => s.title === 'Beginner'));
    assert.ok(llTopic.subsections.some((s) => s.title === 'Intermediate'));
    assert.ok(llTopic.subsections.some((s) => s.title === 'Advanced'));
  });

  it('contains expected topics', () => {
    const slugs = practiceData.map((t) => t.slug);
    assert.ok(slugs.includes('array'));
    assert.ok(slugs.includes('linked-list'));
    assert.ok(slugs.includes('stack-queue'));
    assert.ok(slugs.includes('recursion'));
    assert.ok(slugs.includes('tree'));
    assert.ok(slugs.includes('graph'));
    assert.ok(slugs.includes('dp'));
  });

  it('difficulty values are from a known set', () => {
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          assert.ok(validDifficulties.includes(item.difficulty), `Invalid difficulty '${item.difficulty}' for ${item.id}`);
        });
      });
    });
  });

  it('visualizerUrl values are either valid paths or null', () => {
    const urlPattern = /^\/(visualizer|api|app)\//;
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          const v = item.visualizerUrl;
          assert.ok(v === null || urlPattern.test(v), `Invalid visualizerUrl '${v}' for ${item.id}`);
        });
      });
    });
  });
});

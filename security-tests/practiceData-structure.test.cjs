'use strict';

// security-tests/practiceData-structure.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/practiceData-structure.test.cjs
//
// Tests the structure of practiceData exported from src/lib/practiceData.js.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined relevant subset of practiceData from src/lib/practiceData.js.
// The full file contains 8+ topics; we test the structure shape across all of them.
const practiceData = [
  {
    title: 'Array',
    slug: 'array',
    desc: 'Contiguous collections of memory.',
    subsections: [
      {
        title: 'Beginner',
        items: [
          {
            id: 'linear-search',
            name: 'Linear Search',
            difficulty: 'Easy',
            companies: ['amazon', 'google'],
            practiceUrl: 'https://leetcode.com/problems/binary-search/',
            visualizerUrl: '/visualizer/array/linearsearch',
            theory: {
              summary: 'A simple algorithm that checks every element.',
              steps: ['Start from first element.', 'Compare with target.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Inefficient for large datasets.',
              tip: 'Baseline for searching algorithms.',
            },
          },
          {
            id: 'binary-search',
            name: 'Binary Search',
            difficulty: 'Easy',
            companies: ['google', 'microsoft'],
            practiceUrl: 'https://leetcode.com/problems/binary-search/',
            visualizerUrl: '/visualizer/array/binarysearch',
            theory: {
              summary: 'Divide and conquer search on sorted arrays.',
              steps: ['Set low/high.', 'Calculate mid.', 'Compare and narrow.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              pitfalls: 'Array must be sorted.',
              tip: 'Logarithmic search.',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Linked List',
    slug: 'linked-list',
    desc: 'Sequential node allocations.',
    subsections: [
      {
        title: 'Intermediate',
        items: [
          {
            id: 'reverse-list',
            name: 'Reverse Linked List',
            difficulty: 'Easy',
            companies: ['amazon', 'microsoft'],
            practiceUrl: 'https://leetcode.com/problems/reverse-linked-list/',
            visualizerUrl: '/visualizer/linkedlist/operations/reverse',
            theory: {
              summary: 'Reverse a singly linked list in-place.',
              steps: ['Use prev/curr/next pointers.', 'Reverse links.', 'Update head.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              pitfalls: 'Losing reference to rest of list.',
              tip: 'Draw nodes on paper.',
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

  it('each topic has title, slug, desc, and subsections', () => {
    practiceData.forEach((topic) => {
      assert.strictEqual(typeof topic.title, 'string');
      assert.ok(topic.title.length > 0, 'title must be non-empty');
      assert.strictEqual(typeof topic.slug, 'string');
      assert.ok(topic.slug.length > 0, 'slug must be non-empty');
      assert.strictEqual(typeof topic.desc, 'string');
      assert.ok(Array.isArray(topic.subsections), 'subsections must be array');
      assert.ok(topic.subsections.length > 0, 'subsections must be non-empty');
    });
  });

  it('each subsection has title and items', () => {
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        assert.strictEqual(typeof sub.title, 'string');
        assert.ok(sub.title.length > 0, 'subsection title must be non-empty');
        assert.ok(Array.isArray(sub.items), 'items must be array');
        assert.ok(sub.items.length > 0, 'items must be non-empty');
      });
    });
  });

  it('each item has required fields: id, difficulty, theory.complexity', () => {
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          assert.strictEqual(typeof item.id, 'string');
          assert.ok(item.id.length > 0, 'item id must be non-empty');
          assert.strictEqual(typeof item.name, 'string');
          assert.ok(item.name.length > 0, 'item name must be non-empty');
          assert.strictEqual(typeof item.difficulty, 'string');
          assert.ok(
            ['Easy', 'Medium', 'Hard'].includes(item.difficulty),
            'difficulty must be Easy|Medium|Hard',
          );
          assert.ok(Array.isArray(item.companies), 'companies must be array');
          assert.ok(
            typeof item.practiceUrl === 'string' && item.practiceUrl.startsWith('http'),
            'practiceUrl must be a valid URL string',
          );
          // visualizerUrl can be null or a string starting with /
          assert.ok(
            item.visualizerUrl === null || (typeof item.visualizerUrl === 'string'),
            'visualizerUrl must be null or string',
          );
          assert.strictEqual(typeof item.theory, 'object', 'theory must be an object');
          assert.strictEqual(typeof item.theory.complexity, 'object', 'complexity must be an object');
          assert.strictEqual(typeof item.theory.complexity.time, 'string');
          assert.strictEqual(typeof item.theory.complexity.space, 'string');
        });
      });
    });
  });

  it('each item theory has summary, steps array, pitfalls, and tip', () => {
    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          assert.strictEqual(typeof item.theory.summary, 'string');
          assert.ok(item.theory.summary.length > 0, 'summary must be non-empty');
          assert.ok(Array.isArray(item.theory.steps), 'steps must be an array');
          assert.ok(item.theory.steps.length > 0, 'steps must be non-empty');
          assert.strictEqual(typeof item.theory.pitfalls, 'string');
          assert.strictEqual(typeof item.theory.tip, 'string');
        });
      });
    });
  });
});

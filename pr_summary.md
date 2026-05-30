## Summary

This PR refactors the AlgoBuddy routing structure to follow a data structure topic hierarchy rather than algorithm categories. This aligns the URL structure with the platform's organizational logic, where users enter a topic (Array, Linked List, Stack, Queue, Tree) before selecting an algorithm.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [x] Refactor
- [x] UI/UX Improvement

## Related Issues

Closes #517

## Changes Made

- **Directory Reorganization**: Moved all algorithm visualizer pages into new topic-based folders (`array`, `linkedlist`, `stack`, `queue`, `tree`) and removed the old `searching`, `sorting`, and `operations` category folders.
- **Improved Hierarchy**: URLs now accurately reflect the platform hierarchy (e.g., `/visualizer/array/binarysearch` instead of `/visualizer/searching/binarysearch`).
- **Data Synchronization**: Updated `lib/visualizerSections.js` to ensure all homepage cards and topic pages point to the new routes.
- **Breadcrumb Fix**: Updated `Breadcrumbs.jsx` to correctly map the new topic-based URL structure, ensuring segments like "Array" or "Tree" link back to their respective gallery views.
- **Tree UI & Theme**:
  - Wrapped all Tree BST and Traversal pages with `VisualizerPageLayout` for consistent breadcrumbs.
  - Updated `TreeBSTVisualizer` and `TreeTraversalVisualizer` to a **premium white theme** (previously dark).
- **Restoration of Missing Operations**: Recovered and restored missing Queue operation folders (`peekfront`, `isempty`, `isfull`) that were omitted during the initial refactor.
- **Category Index Pages**: Generated index pages for all top-level topics (Array, LinkedList, Stack, Queue, Tree, etc.) to ensure breadcrumb segments are navigateable.
- **Link & Import Integrity**: Fixed broken imports for animations/code-blocks and updated all "Explore Other" navigation links across all algorithm pages.

## Testing

- [x] I have tested this locally (verified 200 OK for all refactored routes)
- [ ] I have added/updated tests
- [x] All existing tests pass

## Screenshots

| Before (Category Path) | After (Topic Hierarchy) |
| :--- | :--- |
| `/visualizer/searching/binarysearch` | `/visualizer/array/binarysearch` |
| `Home > Visualizer > Searching` | `Home > Visualizer > Array` |
| Dark-themed Tree components | Premium White-themed Tree components |

## Checklist

- [x] My code follows the project style guidelines
- [x] I have performed a self-review
- [x] I have commented complex code
- [x] I have updated the documentation (breadcrumbs, navigation links, and category pages)

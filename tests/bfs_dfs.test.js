const Graph = require('../server/algorithms/graph');
const { bfs } = require('../server/algorithms/bfs');
const { dfs } = require('../server/algorithms/dfs');

describe('Mathematical Rigor: BFS & DFS Graph Traversals', () => {
  let g;

  beforeEach(() => {
    g = new Graph();
    // Tree graph: A is root, B & C are children of A, D & E are children of B
    ['A', 'B', 'C', 'D', 'E'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
    g.addEdge('B', 'D');
    g.addEdge('B', 'E');
  });

  test('BFS: Level-by-level queue traversal and shortest distances', () => {
    const result = bfs(g, 'A');

    expect(result.traversalOrder).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(result.distances['A']).toBe(0);
    expect(result.distances['B']).toBe(1);
    expect(result.distances['C']).toBe(1);
    expect(result.distances['D']).toBe(2);
    expect(result.distances['E']).toBe(2);
    expect(result.treeEdges).toHaveLength(4);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  test('DFS: Discovery times, finish times, and stack behavior', () => {
    const result = dfs(g, 'A');

    expect(result.traversalOrder).toEqual(['A', 'B', 'D', 'E', 'C']);
    expect(result.discoveryTimes['A']).toBe(1);
    expect(result.finishTimes['C']).toBeLessThanOrEqual(10);
    expect(result.hasCycles).toBe(false); // Tree has no cycles
  });

  test('DFS: Cycle detection using Back-edges', () => {
    // Add cycle edge C-E
    g.addEdge('C', 'E');
    const result = dfs(g, 'A');

    expect(result.hasCycles).toBe(true);
    expect(result.backEdges.length).toBeGreaterThan(0);
  });
});

const Graph = require('../server/algorithms/graph');

describe('Mathematical Rigor: Graph Core Data Structure & Properties', () => {
  let g;

  beforeEach(() => {
    g = new Graph();
  });

  test('Mathematical formulation: V(G) and E(G) sets addition and removal', () => {
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');

    expect(g.getVertices()).toEqual(['A', 'B', 'C']);
    expect(g.getEdges()).toHaveLength(2);
    expect(g.hasEdge('A', 'B')).toBe(true);
    expect(g.hasEdge('B', 'A')).toBe(true); // Undirected symmetry
    expect(g.hasEdge('A', 'C')).toBe(false);

    // Remove vertex
    g.removeVertex('B');
    expect(g.getVertices()).toEqual(['A', 'C']);
    expect(g.getEdges()).toHaveLength(0); // Incident edges (A,B) and (B,C) removed
  });

  test('Handshaking Lemma: sum(deg(v)) = 2 * |E| on K_4', () => {
    // Complete graph K_4 has 4 vertices and 6 edges
    ['A', 'B', 'C', 'D'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
    g.addEdge('A', 'D');
    g.addEdge('B', 'C');
    g.addEdge('B', 'D');
    g.addEdge('C', 'D');

    const handshaking = g.getHandshakingLemma();
    expect(handshaking.edgeCount).toBe(6);
    expect(handshaking.sumOfDegrees).toBe(12);
    expect(handshaking.twiceEdges).toBe(12);
    expect(handshaking.holds).toBe(true);
    expect(handshaking.oddCount % 2).toBe(0); // Number of odd vertices is always even
  });

  test('Adjacency Matrix A(G) symmetry and row sums', () => {
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');

    const { matrix, vertexOrder } = g.getAdjacencyMatrix();
    expect(vertexOrder).toEqual(['A', 'B', 'C']);
    expect(matrix).toEqual([
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 0]
    ]);

    // Row sum equals degree of vertex
    const rowSumA = matrix[0].reduce((sum, val) => sum + val, 0);
    expect(rowSumA).toBe(g.getDegree('A'));
  });

  test('Mathematical Edge Cases: Empty graph, Isolated vertex, Disconnected graph', () => {
    // 1. Empty Graph
    const emptyG = new Graph();
    expect(emptyG.getVertices()).toHaveLength(0);
    expect(emptyG.getEdges()).toHaveLength(0);
    expect(emptyG.isConnected()).toBe(true);
    expect(emptyG.getConnectedComponents()).toEqual([]);

    // 2. Trivial 1-vertex graph
    const singleG = new Graph();
    singleG.addVertex('Z');
    expect(singleG.isConnected()).toBe(true);
    expect(singleG.getDegree('Z')).toBe(0);
    expect(singleG.getIsolatedVertices()).toEqual(['Z']);

    // 3. Disconnected graph with isolated node
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C'); // Isolated
    g.addEdge('A', 'B');

    expect(g.isConnected()).toBe(false);
    expect(g.getConnectedComponents()).toHaveLength(2);
    expect(g.getIsolatedVertices()).toEqual(['C']);
    expect(g.getPendantVertices()).toEqual(['A', 'B']);
  });
});

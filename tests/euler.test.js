const Graph = require('../server/algorithms/graph');
const {
  analyzeEulerianProperties,
  findEulerTrail,
  validateEulerWalk
} = require('../server/algorithms/euler');

describe('Mathematical Rigor: Eulerian Path & Circuit Algorithms', () => {
  test('Euler Circuit Theorem: Graph with all even degrees has an Euler Circuit', () => {
    const g = new Graph();
    // Cycle C_4: all degrees = 2 (0 odd vertices)
    ['A', 'B', 'C', 'D'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'D');
    g.addEdge('D', 'A');

    const analysis = analyzeEulerianProperties(g);
    expect(analysis.hasEulerCircuit).toBe(true);
    expect(analysis.hasEulerPath).toBe(true);
    expect(analysis.oddCount).toBe(0);

    const trail = findEulerTrail(g, 'A');
    expect(trail.path).not.toBeNull();
    expect(trail.edgeSequence).toHaveLength(4);
    expect(trail.path[0]).toBe(trail.path[trail.path.length - 1]); // Circuit closes
  });

  test('Euler Path Theorem: Graph with exactly 2 odd vertices has an Euler Path (no circuit)', () => {
    const g = new Graph();
    // Path P_3: A-B-C (A and C have deg 1, B has deg 2 -> 2 odd vertices)
    ['A', 'B', 'C'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');

    const analysis = analyzeEulerianProperties(g);
    expect(analysis.hasEulerCircuit).toBe(false);
    expect(analysis.hasEulerPath).toBe(true);
    expect(analysis.oddCount).toBe(2);
    expect(analysis.oddDegreeVertices.sort()).toEqual(['A', 'C']);

    const trail = findEulerTrail(g);
    expect(trail.path).not.toBeNull();
    expect(trail.path[0] === 'A' || trail.path[0] === 'C').toBe(true);
  });

  test('Euler Walk Validator: Catches repeated edges and incomplete walks', () => {
    const g = new Graph();
    ['A', 'B', 'C'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'A');

    // Valid circuit
    const validCircuit = validateEulerWalk(g, ['A', 'B', 'C', 'A'], 'CIRCUIT');
    expect(validCircuit.isValid).toBe(true);

    // Repeated edge violation
    const repeated = validateEulerWalk(g, ['A', 'B', 'A', 'B'], 'PATH');
    expect(repeated.isValid).toBe(false);
    expect(repeated.reason).toContain('Eulerian violation');

    // Incomplete walk
    const incomplete = validateEulerWalk(g, ['A', 'B'], 'PATH');
    expect(incomplete.isValid).toBe(false);
    expect(incomplete.reason).toContain('Incomplete traversal');
  });
});

const Graph = require('../server/algorithms/graph');
const {
  evaluateHamiltonianTheorems,
  findHamiltonian,
  validateHamiltonWalk
} = require('../server/algorithms/hamilton');
const GraphGenerator = require('../server/algorithms/generator');

describe('Mathematical Rigor: Hamiltonian Path & Cycle Algorithms', () => {
  test("Dirac's Theorem on Complete Graph K_4: deg(v) >= n/2 guarantees Hamiltonian Cycle", () => {
    const k4 = GraphGenerator.complete(4);
    const theorems = evaluateHamiltonianTheorems(k4);

    expect(theorems.diracSatisfied).toBe(true);
    expect(theorems.diracExplanation).toContain("Dirac's Theorem HOLDS");

    const result = findHamiltonian(k4, 'A');
    expect(result.hasCycle).toBe(true);
    expect(result.hamiltonianCycle).toHaveLength(5); // A -> ... -> A
  });

  test('Hamiltonian Walk Validator: Catches vertex repetition and skipped vertices', () => {
    const g = new Graph();
    ['A', 'B', 'C', 'D'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'D');
    g.addEdge('D', 'A');

    // Valid cycle
    const valid = validateHamiltonWalk(g, ['A', 'B', 'C', 'D', 'A'], 'CYCLE');
    expect(valid.isValid).toBe(true);

    // Repeated vertex violation
    const repeated = validateHamiltonWalk(g, ['A', 'B', 'C', 'B'], 'PATH');
    expect(repeated.isValid).toBe(false);
    expect(repeated.reason).toContain('Hamiltonian violation');

    // Missing vertex
    const missing = validateHamiltonWalk(g, ['A', 'B', 'C'], 'PATH');
    expect(missing.isValid).toBe(false);
    expect(missing.reason).toContain('Incomplete path');
  });

  test('Petersen Graph is non-Eulerian and non-Hamiltonian', () => {
    const petersen = GraphGenerator.petersen();
    const result = findHamiltonian(petersen);
    // Petersen graph has Hamiltonian paths, but NO Hamiltonian Cycle!
    expect(result.hasCycle).toBe(false);
    expect(result.hasPath).toBe(true);
  });
});

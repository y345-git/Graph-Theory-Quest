/**
 * GraphQuest - Hamiltonian Path & Cycle Algorithms, Backtracking Solver & Theorems
 * Discrete Mathematics (7MA206) - Module 4: Hamiltonian Graphs
 */

const Graph = require('./graph');

/**
 * Evaluate theoretical sufficiency conditions for Hamiltonian cycles (Dirac & Ore Theorems)
 * @param {Graph} graph 
 * @returns {{
 *   diracSatisfied: boolean,
 *   diracExplanation: string,
 *   oreSatisfied: boolean,
 *   oreExplanation: string
 * }}
 */
function evaluateHamiltonianTheorems(graph) {
  const vertices = graph.getVertices();
  const n = vertices.length;

  if (n < 3) {
    return {
      diracSatisfied: false,
      diracExplanation: `Dirac's Theorem requires |V| >= 3 (Current: ${n}).`,
      oreSatisfied: false,
      oreExplanation: `Ore's Theorem requires |V| >= 3 (Current: ${n}).`
    };
  }

  // Dirac's Theorem: for every v in V, deg(v) >= n / 2
  const minDegRequired = n / 2;
  const failingDirac = [];
  for (const v of vertices) {
    const deg = graph.getDegree(v);
    if (deg < minDegRequired) {
      failingDirac.push(`${v} (deg=${deg} < ${minDegRequired})`);
    }
  }

  const diracSatisfied = failingDirac.length === 0;
  const diracExplanation = diracSatisfied
    ? `Dirac's Theorem HOLDS: For all ${n} vertices, deg(v) >= ${minDegRequired} (n/2). Therefore, G is guaranteed to be Hamiltonian.`
    : `Dirac's Theorem is inconclusive: Vertices with deg < ${minDegRequired}: [${failingDirac.join(', ')}]. (Dirac is sufficient, not necessary).`;

  // Ore's Theorem: for all non-adjacent pairs (u, v), deg(u) + deg(v) >= n
  const nonAdjacentPairs = [];
  const failingOre = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const u = vertices[i];
      const v = vertices[j];
      if (!graph.hasEdge(u, v)) {
        const sumDeg = graph.getDegree(u) + graph.getDegree(v);
        nonAdjacentPairs.push({ u, v, sumDeg });
        if (sumDeg < n) {
          failingOre.push(`(${u}, ${v}): deg(${u})+deg(${v}) = ${sumDeg} < ${n}`);
        }
      }
    }
  }

  const oreSatisfied = nonAdjacentPairs.length > 0 && failingOre.length === 0;
  const oreExplanation = oreSatisfied
    ? `Ore's Theorem HOLDS: For all non-adjacent pairs (u,v), deg(u)+deg(v) >= ${n}. Therefore, G is guaranteed to be Hamiltonian.`
    : failingOre.length === 0 && nonAdjacentPairs.length === 0
      ? `Complete graph K_${n}: Graph has no non-adjacent pairs. Trivally Hamiltonian.`
      : `Ore's Theorem is inconclusive: Failing non-adjacent pairs: [${failingOre.join(', ')}].`;

  return {
    diracSatisfied,
    diracExplanation,
    oreSatisfied,
    oreExplanation
  };
}

/**
 * Backtracking solver for Hamiltonian Path & Cycle
 * @param {Graph} graph 
 * @param {string} [startVertex]
 * @returns {{
 *   hasCycle: boolean,
 *   hasPath: boolean,
 *   hamiltonianCycle: string[] | null,
 *   hamiltonianPath: string[] | null,
 *   allCycles: Array<string[]>,
 *   allPaths: Array<string[]>,
 *   steps: Array<{ stepIndex: number, currentPath: string[], action: string, description: string }>
 * }}
 */
function findHamiltonian(graph, startVertex = null) {
  const vertices = graph.getVertices();
  const n = vertices.length;

  if (n === 0) {
    return {
      hasCycle: false,
      hasPath: false,
      hamiltonianCycle: null,
      hamiltonianPath: null,
      allCycles: [],
      allPaths: [],
      steps: []
    };
  }

  if (n === 1) {
    const v = vertices[0];
    return {
      hasCycle: true,
      hasPath: true,
      hamiltonianCycle: [v, v],
      hamiltonianPath: [v],
      allCycles: [[v, v]],
      allPaths: [[v]],
      steps: []
    };
  }

  const allPaths = [];
  const allCycles = [];
  const steps = [];
  let stepIndex = 0;

  const startsToTest = startVertex && graph.hasVertex(startVertex)
    ? [startVertex]
    : vertices;

  for (const start of startsToTest) {
    const currentPath = [start];
    const visited = new Set([start]);

    steps.push({
      stepIndex: ++stepIndex,
      action: 'START_SEARCH',
      currentVertex: start,
      activeEdge: null,
      stack: [...currentPath],
      visited: Array.from(visited),
      description: `Backtracking start: Begin exploring paths from vertex '${start}'.`
    });

    function backtrack(curr) {
      if (currentPath.length === n) {
        // Path visits all vertices exactly once
        allPaths.push([...currentPath]);

        steps.push({
          stepIndex: ++stepIndex,
          action: 'PATH_FOUND',
          currentVertex: curr,
          activeEdge: null,
          stack: [...currentPath],
          visited: Array.from(visited),
          description: `Hamiltonian Path found: [${currentPath.join(' → ')}]. Checking if edge (${curr}, ${start}) closes the cycle...`
        });

        // Check if edge exists back to start for a Hamiltonian Cycle
        if (graph.hasEdge(curr, start)) {
          const cycle = [...currentPath, start];
          allCycles.push(cycle);
          steps.push({
            stepIndex: ++stepIndex,
            action: 'CYCLE_FOUND',
            currentVertex: start,
            activeEdge: [curr, start],
            stack: cycle,
            visited: Array.from(visited),
            description: `Edge (${curr}, ${start}) exists! Closed Hamiltonian Cycle found: [${cycle.join(' → ')}].`
          });
        } else {
          steps.push({
            stepIndex: ++stepIndex,
            action: 'NOT_A_CYCLE',
            currentVertex: curr,
            activeEdge: null,
            stack: [...currentPath],
            visited: Array.from(visited),
            description: `No edge between '${curr}' and '${start}'. Path is not a cycle.`
          });
        }
        return;
      }

      const neighbors = graph.getNeighbors(curr);
      let foundValidBranch = false;

      for (const next of neighbors) {
        if (!visited.has(next)) {
          foundValidBranch = true;
          visited.add(next);
          currentPath.push(next);

          steps.push({
            stepIndex: ++stepIndex,
            action: 'FORWARD',
            currentVertex: next,
            activeEdge: [curr, next],
            stack: [...currentPath],
            visited: Array.from(visited),
            description: `Traverse edge (${curr}, ${next}). Current path length: ${currentPath.length}/${n}. Path: [${currentPath.join(' → ')}].`
          });

          backtrack(next);

          // Backtrack step
          currentPath.pop();
          visited.delete(next);

          steps.push({
            stepIndex: ++stepIndex,
            action: 'BACKTRACK',
            currentVertex: curr,
            activeEdge: [curr, next],
            stack: [...currentPath],
            visited: Array.from(visited),
            description: `Backtracked from '${next}'. Returning to explore other branches from '${curr}'.`
          });
        }
      }

      if (!foundValidBranch && currentPath.length < n) {
        steps.push({
          stepIndex: ++stepIndex,
          action: 'DEAD_END',
          currentVertex: curr,
          activeEdge: null,
          stack: [...currentPath],
          visited: Array.from(visited),
          description: `Dead end at '${curr}'. All adjacent neighbors are already in the current path.`
        });
      }
    }

    backtrack(start);
    if (allCycles.length > 0 && !startVertex) {
      // If we found a cycle and user didn't request exhaustive start search
      break;
    }
  }

  if (steps.length > 0 && steps[steps.length - 1].action !== 'CYCLE_FOUND' && steps[steps.length - 1].action !== 'PATH_FOUND') {
    steps.push({
      stepIndex: ++stepIndex,
      action: 'COMPLETE',
      currentVertex: null,
      activeEdge: null,
      stack: [],
      visited: [],
      description: allCycles.length > 0
        ? `Search complete: Hamiltonian Cycle exists: [${allCycles[0].join(' → ')}].`
        : allPaths.length > 0
          ? `Search complete: Hamiltonian Path exists: [${allPaths[0].join(' → ')}], but no Hamiltonian Cycle.`
          : 'Search complete: No Hamiltonian Path or Cycle exists in this graph.'
    });
  }

  return {
    hasCycle: allCycles.length > 0,
    hasPath: allPaths.length > 0,
    hamiltonianCycle: allCycles.length > 0 ? allCycles[0] : null,
    hamiltonianPath: allPaths.length > 0 ? allPaths[0] : null,
    allCycles,
    allPaths,
    steps: steps.slice(0, 150) // Cap steps for animation payload size
  };
}

/**
 * Validate a user-provided walk against Hamiltonian rules
 * @param {Graph} graph 
 * @param {string[]} walk 
 * @param {'PATH' | 'CYCLE'} targetType 
 * @returns {{
 *   isValid: boolean,
 *   reason: string,
 *   verticesVisited: string[],
 *   missingVertices: string[],
 *   repeatedVertices: string[],
 *   invalidEdges: Array<[string, string]>
 * }}
 */
function validateHamiltonWalk(graph, walk, targetType = 'PATH') {
  const vertices = graph.getVertices();
  const n = vertices.length;

  if (!Array.isArray(walk) || walk.length === 0) {
    return {
      isValid: false,
      reason: 'Please provide a valid vertex sequence.',
      verticesVisited: [],
      missingVertices: vertices,
      repeatedVertices: [],
      invalidEdges: []
    };
  }

  // Check valid vertices
  for (const v of walk) {
    if (!graph.hasVertex(v)) {
      return {
        isValid: false,
        reason: `Vertex '${v}' does not belong to the graph's vertex set V(G).`,
        verticesVisited: [],
        missingVertices: [],
        repeatedVertices: [],
        invalidEdges: []
      };
    }
  }

  // Check valid edges
  const invalidEdges = [];
  for (let i = 0; i < walk.length - 1; i++) {
    const u = walk[i];
    const v = walk[i + 1];
    if (!graph.hasEdge(u, v)) {
      invalidEdges.push([u, v]);
      return {
        isValid: false,
        reason: `Invalid transition: Edge (${u}, ${v}) does not exist in graph E(G).`,
        verticesVisited: walk,
        missingVertices: [],
        repeatedVertices: [],
        invalidEdges
      };
    }
  }

  if (targetType === 'PATH') {
    // Hamiltonian Path: every vertex visited exactly once, length = n
    const seen = new Set();
    const repeated = [];

    for (const v of walk) {
      if (seen.has(v)) {
        repeated.push(v);
      }
      seen.add(v);
    }

    if (repeated.length > 0) {
      return {
        isValid: false,
        reason: `Hamiltonian violation: Vertex '${repeated[0]}' was visited multiple times. A Hamiltonian Path requires every vertex to be visited EXACTLY ONCE.`,
        verticesVisited: Array.from(seen),
        missingVertices: vertices.filter(v => !seen.has(v)),
        repeatedVertices: repeated,
        invalidEdges: []
      };
    }

    const missing = vertices.filter(v => !seen.has(v));
    if (missing.length > 0) {
      return {
        isValid: false,
        reason: `Incomplete path: Missing vertices [${missing.join(', ')}]. Visited ${seen.size}/${n} vertices.`,
        verticesVisited: Array.from(seen),
        missingVertices: missing,
        repeatedVertices: [],
        invalidEdges: []
      };
    }

    return {
      isValid: true,
      reason: `✅ Brilliant! You visited all ${n} vertices exactly once along valid edges. Valid Hamiltonian Path!`,
      verticesVisited: Array.from(seen),
      missingVertices: [],
      repeatedVertices: [],
      invalidEdges: []
    };
  }

  // targetType === 'CYCLE'
  // Hamiltonian Cycle: length = n + 1, walk[0] === walk[n], all middle vertices distinct
  const startV = walk[0];
  const endV = walk[walk.length - 1];

  if (startV !== endV) {
    return {
      isValid: false,
      reason: `Cycle violation: A Hamiltonian Cycle must close and return to the starting vertex '${startV}', but ends at '${endV}'.`,
      verticesVisited: walk,
      missingVertices: [],
      repeatedVertices: [],
      invalidEdges: []
    };
  }

  const pathVertices = walk.slice(0, walk.length - 1);
  const seen = new Set();
  const repeated = [];

  for (const v of pathVertices) {
    if (seen.has(v)) {
      repeated.push(v);
    }
    seen.add(v);
  }

  if (repeated.length > 0) {
    return {
      isValid: false,
      reason: `Hamiltonian violation: Vertex '${repeated[0]}' was visited more than once in the internal cycle.`,
      verticesVisited: Array.from(seen),
      missingVertices: vertices.filter(v => !seen.has(v)),
      repeatedVertices: repeated,
      invalidEdges: []
    };
  }

  const missing = vertices.filter(v => !seen.has(v));
  if (missing.length > 0) {
    return {
      isValid: false,
      reason: `Incomplete cycle: Cycle missed vertices [${missing.join(', ')}]. Visited ${seen.size}/${n} vertices before returning to start.`,
      verticesVisited: Array.from(seen),
      missingVertices: missing,
      repeatedVertices: [],
      invalidEdges: []
    };
  }

  return {
    isValid: true,
    reason: `✅ Masterful! You visited all ${n} vertices exactly once and closed the cycle back at '${startV}'. Valid Hamiltonian Cycle!`,
    verticesVisited: Array.from(seen),
    missingVertices: [],
    repeatedVertices: [],
    invalidEdges: []
  };
}

module.exports = {
  evaluateHamiltonianTheorems,
  findHamiltonian,
  validateHamiltonWalk
};

/**
 * GraphQuest - Eulerian Path & Circuit Algorithms & Mathematical Validation
 * Discrete Mathematics (7MA206) - Module 3: Eulerian Graphs
 */

const Graph = require('./graph');

/**
 * Check Eulerian properties based on Euler's Theorem (1736)
 * @param {Graph} graph 
 * @returns {{
 *   hasEulerCircuit: boolean,
 *   hasEulerPath: boolean,
 *   eulerType: 'CIRCUIT' | 'PATH' | 'NONE',
 *   oddDegreeVertices: string[],
 *   evenDegreeVertices: string[],
 *   oddCount: number,
 *   startVertices: string[],
 *   reasoning: string,
 *   isEulerianConnected: boolean
 * }}
 */
function analyzeEulerianProperties(graph) {
  const vertices = graph.getVertices();
  const edges = graph.getEdges();

  if (edges.length === 0) {
    return {
      hasEulerCircuit: true,
      hasEulerPath: true,
      eulerType: 'CIRCUIT',
      oddDegreeVertices: [],
      evenDegreeVertices: vertices,
      oddCount: 0,
      startVertices: vertices,
      reasoning: 'Trivial/Empty graph (0 edges). Vacuously satisfies Eulerian Circuit and Path conditions.',
      isEulerianConnected: true
    };
  }

  // Check connectivity of non-isolated vertices
  const nonIsolated = vertices.filter(v => graph.getDegree(v) > 0);
  const components = graph.getConnectedComponents();
  const nonIsolatedComponents = components.filter(c => c.some(v => graph.getDegree(v) > 0));

  const isEulerianConnected = nonIsolatedComponents.length <= 1;

  if (!isEulerianConnected) {
    return {
      hasEulerCircuit: false,
      hasEulerPath: false,
      eulerType: 'NONE',
      oddDegreeVertices: [],
      evenDegreeVertices: [],
      oddCount: 0,
      startVertices: [],
      reasoning: `Graph has ${nonIsolatedComponents.length} separate components with edges. An Euler Path/Circuit requires all edges to reside in a single connected component.`,
      isEulerianConnected: false
    };
  }

  const oddDegreeVertices = [];
  const evenDegreeVertices = [];

  for (const v of nonIsolated) {
    const deg = graph.getDegree(v);
    if (deg % 2 !== 0) {
      oddDegreeVertices.push(v);
    } else {
      evenDegreeVertices.push(v);
    }
  }

  const oddCount = oddDegreeVertices.length;
  let hasEulerCircuit = false;
  let hasEulerPath = false;
  let eulerType = 'NONE';
  let startVertices = [];
  let reasoning = '';

  if (oddCount === 0) {
    hasEulerCircuit = true;
    hasEulerPath = true; // Every Euler circuit is also an Euler path
    eulerType = 'CIRCUIT';
    startVertices = nonIsolated;
    reasoning = `Euler's Theorem: All ${nonIsolated.length} vertices have EVEN degrees (odd count = 0) and edges are in one connected component. Therefore, an EULER CIRCUIT exists (which can start at ANY vertex).`;
  } else if (oddCount === 2) {
    hasEulerCircuit = false;
    hasEulerPath = true;
    eulerType = 'PATH';
    startVertices = oddDegreeVertices;
    reasoning = `Euler's Theorem: Exactly 2 vertices have ODD degree (${oddDegreeVertices.join(', ')}). Therefore, an EULER PATH exists, which MUST start at '${oddDegreeVertices[0]}' and end at '${oddDegreeVertices[1]}' (or vice-versa). No Euler Circuit is possible.`;
  } else {
    hasEulerCircuit = false;
    hasEulerPath = false;
    eulerType = 'NONE';
    startVertices = [];
    reasoning = `Euler's Theorem: Graph contains ${oddCount} vertices with ODD degrees (${oddDegreeVertices.join(', ')}). An Euler Path requires at most 2 odd-degree vertices. Therefore, NO Eulerian Path or Circuit exists.`;
  }

  return {
    hasEulerCircuit,
    hasEulerPath,
    eulerType,
    oddDegreeVertices,
    evenDegreeVertices,
    oddCount,
    startVertices,
    reasoning,
    isEulerianConnected
  };
}

/**
 * Hierholzer's Algorithm to construct an Euler Path or Circuit
 * Time Complexity: O(|E|)
 * 
 * @param {Graph} graph 
 * @param {string} [preferredStart]
 * @returns {{
 *   path: string[] | null,
 *   edgeSequence: Array<[string, string]>,
 *   steps: Array<{ stepIndex: number, current: string, stack: string[], circuit: string[], description: string }>
 * }}
 */
function findEulerTrail(graph, preferredStart = null) {
  const analysis = analyzeEulerianProperties(graph);
  if (!analysis.hasEulerPath) {
    return {
      path: null,
      edgeSequence: [],
      steps: [{
        stepIndex: 1,
        action: 'INELIGIBLE',
        currentVertex: null,
        activeEdge: null,
        stack: [],
        circuit: [],
        description: `Cannot compute Euler Trail: ${analysis.reasoning}`
      }],
      error: analysis.reasoning
    };
  }

  if (graph.getEdges().length === 0) {
    const v = graph.getVertices()[0] || 'A';
    return {
      path: [v],
      edgeSequence: [],
      steps: [{
        stepIndex: 1,
        action: 'COMPLETE',
        currentVertex: v,
        activeEdge: null,
        stack: [v],
        circuit: [v],
        description: `Trivial graph with 0 edges. Euler path is single vertex '${v}'.`
      }]
    };
  }

  // Determine starting vertex
  let start = preferredStart;
  if (!start || !analysis.startVertices.includes(start)) {
    start = analysis.startVertices[0];
  }

  // Build mutable adjacency multiset
  const adj = new Map();
  for (const v of graph.getVertices()) {
    adj.set(v, []);
  }
  for (const [u, v] of graph.getEdges()) {
    adj.get(u).push(v);
    adj.get(v).push(u);
  }

  const stack = [start];
  const circuit = [];
  const steps = [];
  let stepIndex = 0;

  steps.push({
    stepIndex: ++stepIndex,
    action: 'START',
    currentVertex: start,
    activeEdge: null,
    stack: [...stack],
    circuit: [...circuit],
    description: `Hierholzer Start: Begin at vertex '${start}' (Degree: ${graph.getDegree(start)}). Push '${start}' onto stack.`
  });

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const neighbors = adj.get(curr);

    if (neighbors && neighbors.length > 0) {
      // Pick next neighbor and remove edge in both directions
      const next = neighbors.pop();
      const nextAdj = adj.get(next);
      const backIdx = nextAdj.indexOf(curr);
      if (backIdx !== -1) nextAdj.splice(backIdx, 1);

      stack.push(next);
      steps.push({
        stepIndex: ++stepIndex,
        action: 'FORWARD_EDGE',
        currentVertex: next,
        activeEdge: [curr, next],
        stack: [...stack],
        circuit: [...circuit],
        description: `Traverse unused edge (${curr}, ${next}). Stack: [${stack.join(' → ')}]. Remaining unused edges on '${next}': ${nextAdj.length}.`
      });
    } else {
      // No more edges from curr, backtrack and append to circuit
      const popped = stack.pop();
      circuit.push(popped);
      steps.push({
        stepIndex: ++stepIndex,
        action: 'BACKTRACK_CIRCUIT',
        currentVertex: popped,
        activeEdge: null,
        stack: [...stack],
        circuit: [...circuit],
        description: `No remaining unused edges incident to '${popped}'. Backtrack & append '${popped}' to Euler trail.`
      });
    }
  }

  // Circuit was built in reverse
  const eulerPath = [...circuit].reverse();

  steps.push({
    stepIndex: ++stepIndex,
    action: 'COMPLETE',
    currentVertex: eulerPath[0],
    activeEdge: null,
    stack: [],
    circuit: eulerPath,
    description: `Hierholzer complete! Full ${analysis.eulerType === 'CIRCUIT' ? 'Euler Circuit' : 'Euler Path'} found: [${eulerPath.join(' → ')}].`
  });

  // Convert vertex path to edge sequence
  const edgeSequence = [];
  for (let i = 0; i < eulerPath.length - 1; i++) {
    edgeSequence.push([eulerPath[i], eulerPath[i + 1]]);
  }

  return {
    path: eulerPath,
    edgeSequence,
    steps,
    eulerType: analysis.eulerType
  };
}

/**
 * Validate a user-provided walk against Eulerian properties
 * @param {Graph} graph 
 * @param {string[]} walk Vertex sequence, e.g. ['A', 'B', 'C', 'A']
 * @param {'PATH' | 'CIRCUIT'} targetType 
 * @returns {{
 *   isValid: boolean,
 *   reason: string,
 *   unusedEdges: Array<[string, string]>,
 *   repeatedEdges: Array<[string, string]>,
 *   invalidEdges: Array<[string, string]>,
 *   edgesVisitedCount: number,
 *   totalEdgesCount: number
 * }}
 */
function validateEulerWalk(graph, walk, targetType = 'PATH') {
  const totalEdges = graph.getEdges();
  const totalEdgesCount = totalEdges.length;

  if (!Array.isArray(walk) || walk.length < 2) {
    if (totalEdgesCount === 0 && walk.length === 1) {
      return {
        isValid: true,
        reason: 'Valid trivial Euler walk on empty graph.',
        unusedEdges: [],
        repeatedEdges: [],
        invalidEdges: [],
        edgesVisitedCount: 0,
        totalEdgesCount: 0
      };
    }
    return {
      isValid: false,
      reason: 'A valid walk must contain at least 2 vertices (1 edge).',
      unusedEdges: totalEdges,
      repeatedEdges: [],
      invalidEdges: [],
      edgesVisitedCount: 0,
      totalEdgesCount
    };
  }

  const usedEdgeTracker = new Map();
  // Standardize undirected edge key: "min(u,v)---max(u,v)"
  const makeKey = (u, v) => (u < v ? `${u}---${v}` : `${v}---${u}`);

  totalEdges.forEach(([u, v]) => {
    usedEdgeTracker.set(makeKey(u, v), 0);
  });

  const repeatedEdges = [];
  const invalidEdges = [];
  let traversedCount = 0;

  for (let i = 0; i < walk.length - 1; i++) {
    const u = walk[i];
    const v = walk[i + 1];

    if (!graph.hasVertex(u)) {
      return {
        isValid: false,
        reason: `Vertex '${u}' does not exist in graph V(G).`,
        unusedEdges: totalEdges,
        repeatedEdges,
        invalidEdges: [[u, v]],
        edgesVisitedCount: traversedCount,
        totalEdgesCount
      };
    }
    if (!graph.hasVertex(v)) {
      return {
        isValid: false,
        reason: `Vertex '${v}' does not exist in graph V(G).`,
        unusedEdges: totalEdges,
        repeatedEdges,
        invalidEdges: [[u, v]],
        edgesVisitedCount: traversedCount,
        totalEdgesCount
      };
    }

    const edgeKey = makeKey(u, v);
    if (!usedEdgeTracker.has(edgeKey)) {
      invalidEdges.push([u, v]);
      return {
        isValid: false,
        reason: `Invalid transition: Edge (${u}, ${v}) does not exist in graph E(G).`,
        unusedEdges: [],
        repeatedEdges,
        invalidEdges,
        edgesVisitedCount: traversedCount,
        totalEdgesCount
      };
    }

    const currentUsage = usedEdgeTracker.get(edgeKey);
    if (currentUsage > 0) {
      repeatedEdges.push([u, v]);
      return {
        isValid: false,
        reason: `Eulerian violation: Edge (${u}, ${v}) was traversed more than once (Step ${i + 1}). An Euler walk requires EVERY edge to be used EXACTLY ONCE.`,
        unusedEdges: [],
        repeatedEdges,
        invalidEdges,
        edgesVisitedCount: traversedCount,
        totalEdgesCount
      };
    }

    usedEdgeTracker.set(edgeKey, currentUsage + 1);
    traversedCount++;
  }

  // Check for any untouched edges
  const unusedEdges = [];
  for (const [key, count] of usedEdgeTracker.entries()) {
    if (count === 0) {
      const [u, v] = key.split('---');
      unusedEdges.push([u, v]);
    }
  }

  if (unusedEdges.length > 0) {
    const unusedStr = unusedEdges.map(([u, v]) => `(${u}, ${v})`).join(', ');
    return {
      isValid: false,
      reason: `Incomplete traversal: ${unusedEdges.length} edge(s) were never visited: [${unusedStr}]. Total edges visited: ${traversedCount}/${totalEdgesCount}.`,
      unusedEdges,
      repeatedEdges: [],
      invalidEdges: [],
      edgesVisitedCount: traversedCount,
      totalEdgesCount
    };
  }

  // Check circuit condition
  if (targetType === 'CIRCUIT') {
    const startV = walk[0];
    const endV = walk[walk.length - 1];
    if (startV !== endV) {
      return {
        isValid: false,
        reason: `Circuit violation: An Euler Circuit must start and end at the SAME vertex. Your walk starts at '${startV}' and ends at '${endV}'. (This is an Euler Path, not a Circuit).`,
        unusedEdges: [],
        repeatedEdges: [],
        invalidEdges: [],
        edgesVisitedCount: traversedCount,
        totalEdgesCount
      };
    }
  }

  return {
    isValid: true,
    reason: targetType === 'CIRCUIT'
      ? `✅ Perfect! You traversed all ${totalEdgesCount} edges exactly once and returned to start vertex '${walk[0]}'. Valid Euler Circuit!`
      : `✅ Correct! You visited all ${totalEdgesCount} edges exactly once from '${walk[0]}' to '${walk[walk.length - 1]}'. Valid Euler Path!`,
    unusedEdges: [],
    repeatedEdges: [],
    invalidEdges: [],
    edgesVisitedCount: traversedCount,
    totalEdgesCount
  };
}

module.exports = {
  analyzeEulerianProperties,
  findEulerTrail,
  validateEulerWalk
};

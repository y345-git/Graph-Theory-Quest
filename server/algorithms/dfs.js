/**
 * GraphQuest - Depth-First Search (DFS) Algorithm with Full Step-by-Step State Trace
 * Discrete Mathematics (7MA206) - Module 2: Graph Traversals & Cycle Detection
 */

const Graph = require('./graph');

/**
 * Execute Depth-First Search with full step-by-step trace & discovery/finishing timestamps
 * Time Complexity: O(|V| + |E|)
 * Space Complexity: O(|V|)
 * 
 * @param {Graph} graph 
 * @param {string} startVertex 
 * @returns {{
 *   traversalOrder: string[],
 *   discoveryTimes: Record<string, number>,
 *   finishTimes: Record<string, number>,
 *   parents: Record<string, string|null>,
 *   treeEdges: Array<[string, string]>,
 *   backEdges: Array<[string, string]>,
 *   hasCycles: boolean,
 *   steps: Array<{
 *     stepIndex: number,
 *     action: 'DISCOVER' | 'EXPLORE_EDGE' | 'BACK_EDGE' | 'BACKTRACK' | 'FINISH' | 'COMPLETE',
 *     currentVertex: string | null,
 *     targetVertex: string | null,
 *     stack: string[],
 *     visited: string[],
 *     activeEdge: [string, string] | null,
 *     description: string
 *   }>
 * }}
 */
function dfs(graph, startVertex) {
  if (!graph.hasVertex(startVertex)) {
    throw new Error(`Start vertex "${startVertex}" not found in graph.`);
  }

  const steps = [];
  const traversalOrder = [];
  const visited = new Set();
  const finished = new Set();
  const discoveryTimes = {};
  const finishTimes = {};
  const parents = {};
  const treeEdges = [];
  const backEdges = [];
  const stack = [];

  for (const v of graph.getVertices()) {
    parents[v] = null;
  }

  let time = 0;
  let stepCount = 0;

  function dfsVisit(u) {
    visited.add(u);
    traversalOrder.push(u);
    stack.push(u);
    time++;
    discoveryTimes[u] = time;

    steps.push({
      stepIndex: ++stepCount,
      action: 'DISCOVER',
      currentVertex: u,
      targetVertex: null,
      stack: [...stack],
      visited: Array.from(visited),
      activeEdge: null,
      description: `Discovered vertex '${u}' at timestamp d[${u}] = ${time}. Push '${u}' to recursion stack.`
    });

    const neighbors = graph.getNeighbors(u);

    for (const v of neighbors) {
      // Ignore edge back to immediate parent in undirected graph
      if (parents[u] === v) continue;

      steps.push({
        stepIndex: ++stepCount,
        action: 'EXPLORE_EDGE',
        currentVertex: u,
        targetVertex: v,
        stack: [...stack],
        visited: Array.from(visited),
        activeEdge: [u, v],
        description: `Inspecting edge (${u}, ${v}) from active vertex '${u}'.`
      });

      if (!visited.has(v)) {
        parents[v] = u;
        treeEdges.push([u, v]);
        dfsVisit(v);
      } else if (!finished.has(v)) {
        // Back edge implies cycle in the graph
        backEdges.push([u, v]);
        steps.push({
          stepIndex: ++stepCount,
          action: 'BACK_EDGE',
          currentVertex: u,
          targetVertex: v,
          stack: [...stack],
          visited: Array.from(visited),
          activeEdge: [u, v],
          description: `Back-edge detected: (${u}, ${v}). Target '${v}' is in active call stack (Cycle detected in G).`
        });
      }
    }

    time++;
    finishTimes[u] = time;
    finished.add(u);
    stack.pop();

    steps.push({
      stepIndex: ++stepCount,
      action: 'FINISH',
      currentVertex: u,
      targetVertex: null,
      stack: [...stack],
      visited: Array.from(visited),
      activeEdge: null,
      description: `Finished processing all neighbors of '${u}'. Timestamp f[${u}] = ${time}. Pop '${u}' from stack. Backtracking.`
    });
  }

  dfsVisit(startVertex);

  steps.push({
    stepIndex: ++stepCount,
    action: 'COMPLETE',
    currentVertex: null,
    targetVertex: null,
    stack: [],
    visited: Array.from(visited),
    activeEdge: null,
    description: `DFS Traversal completed. Total visited vertices: ${visited.size}. Traversal order: [${traversalOrder.join(' → ')}].`
  });

  return {
    startVertex,
    traversalOrder,
    discoveryTimes,
    finishTimes,
    parents,
    treeEdges,
    backEdges,
    hasCycles: backEdges.length > 0,
    reachableCount: visited.size,
    steps
  };
}

module.exports = { dfs };

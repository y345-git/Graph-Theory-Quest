/**
 * GraphQuest - Breadth-First Search (BFS) Algorithm with Full Step-by-Step State Trace
 * Discrete Mathematics (7MA206) - Module 2: Graph Traversals
 */

const Graph = require('./graph');

/**
 * Execute Breadth-First Search with full step-by-step execution trace
 * Time Complexity: O(|V| + |E|)
 * Space Complexity: O(|V|)
 * 
 * @param {Graph} graph 
 * @param {string} startVertex 
 * @returns {{
 *   traversalOrder: string[],
 *   distances: Record<string, number>,
 *   parents: Record<string, string|null>,
 *   treeEdges: Array<[string, string]>,
 *   steps: Array<{
 *     stepIndex: number,
 *     action: 'INIT' | 'DEQUEUE' | 'CHECK_NEIGHBOR' | 'ENQUEUE' | 'COMPLETE',
 *     currentVertex: string | null,
 *     neighborVertex: string | null,
 *     queue: string[],
 *     visited: string[],
 *     distances: Record<string, number>,
 *     activeEdge: [string, string] | null,
 *     description: string
 *   }>
 * }}
 */
function bfs(graph, startVertex) {
  if (!graph.hasVertex(startVertex)) {
    throw new Error(`Start vertex "${startVertex}" not found in graph.`);
  }

  const steps = [];
  const traversalOrder = [];
  const visited = new Set();
  const queue = [];
  const distances = {};
  const parents = {};
  const treeEdges = [];

  // Initialize all vertices with infinity distance
  for (const v of graph.getVertices()) {
    distances[v] = Infinity;
    parents[v] = null;
  }

  let stepCount = 0;

  // Step 1: Start at root vertex
  visited.add(startVertex);
  queue.push(startVertex);
  distances[startVertex] = 0;

  steps.push({
    stepIndex: ++stepCount,
    action: 'INIT',
    currentVertex: startVertex,
    neighborVertex: null,
    queue: [...queue],
    visited: Array.from(visited),
    distances: { ...distances },
    activeEdge: null,
    description: `Initialize BFS: Enqueue source vertex '${startVertex}' with distance d(${startVertex}) = 0. Visited = {${startVertex}}`
  });

  while (queue.length > 0) {
    const current = queue.shift();
    traversalOrder.push(current);

    steps.push({
      stepIndex: ++stepCount,
      action: 'DEQUEUE',
      currentVertex: current,
      neighborVertex: null,
      queue: [...queue],
      visited: Array.from(visited),
      distances: { ...distances },
      activeEdge: null,
      description: `Dequeue vertex '${current}' from front of queue. Exploring its unvisited adjacent neighbors.`
    });

    const neighbors = graph.getNeighbors(current);

    for (const neighbor of neighbors) {
      steps.push({
        stepIndex: ++stepCount,
        action: 'CHECK_NEIGHBOR',
        currentVertex: current,
        neighborVertex: neighbor,
        queue: [...queue],
        visited: Array.from(visited),
        distances: { ...distances },
        activeEdge: [current, neighbor],
        description: `Inspecting edge (${current}, ${neighbor}). Status of '${neighbor}': ${visited.has(neighbor) ? 'ALREADY VISITED' : 'UNVISITED'}.`
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        distances[neighbor] = distances[current] + 1;
        parents[neighbor] = current;
        treeEdges.push([current, neighbor]);
        queue.push(neighbor);

        steps.push({
          stepIndex: ++stepCount,
          action: 'ENQUEUE',
          currentVertex: current,
          neighborVertex: neighbor,
          queue: [...queue],
          visited: Array.from(visited),
          distances: { ...distances },
          activeEdge: [current, neighbor],
          description: `Mark '${neighbor}' as VISITED with d(${neighbor}) = ${distances[neighbor]}. Tree edge added: (${current}, ${neighbor}). Enqueued '${neighbor}'.`
        });
      }
    }
  }

  steps.push({
    stepIndex: ++stepCount,
    action: 'COMPLETE',
    currentVertex: null,
    neighborVertex: null,
    queue: [],
    visited: Array.from(visited),
    distances: { ...distances },
    activeEdge: null,
    description: `BFS Traversal completed. All ${visited.size} reachable vertices discovered. Traversal order: [${traversalOrder.join(' → ')}].`
  });

  return {
    startVertex,
    traversalOrder,
    distances,
    parents,
    treeEdges,
    reachableCount: visited.size,
    isCompleteReach: visited.size === graph.getVertices().length,
    steps
  };
}

module.exports = { bfs };

/**
 * GraphQuest - Graph API Routes
 * Discrete Mathematics (7MA206) - Module Endpoints
 */

const express = require('express');
const router = express.Router();
const Graph = require('../algorithms/graph');
const { bfs } = require('../algorithms/bfs');
const { dfs } = require('../algorithms/dfs');
const { analyzeEulerianProperties, findEulerTrail, validateEulerWalk } = require('../algorithms/euler');
const { evaluateHamiltonianTheorems, findHamiltonian, validateHamiltonWalk } = require('../algorithms/hamilton');
const { computeMatrixPower, computeLaplacian } = require('../algorithms/matrix');
const GraphGenerator = require('../algorithms/generator');

/**
 * Middleware: Parse Graph from request body
 */
function parseGraphBody(req, res, next) {
  try {
    const { vertices, edges, isDirected } = req.body;
    if (!Array.isArray(vertices) || !Array.isArray(edges)) {
      return res.status(400).json({
        error: 'Invalid graph format. Expected { vertices: string[], edges: [string, string][] }'
      });
    }
    const graph = new Graph(Boolean(isDirected));
    vertices.forEach(v => graph.addVertex(String(v)));
    edges.forEach(([u, v]) => {
      if (u && v) graph.addEdge(String(u), String(v));
    });
    req.graph = graph;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Failed to construct graph: ' + err.message });
  }
}

/**
 * POST /api/graph/analyze
 * Comprehensive Mathematical Graph Analysis
 */
router.post('/analyze', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const baseAnalysis = graph.analyze();
    const eulerAnalysis = analyzeEulerianProperties(graph);
    const eulerTrail = eulerAnalysis.hasEulerPath ? findEulerTrail(graph) : null;
    const hamiltonTheorems = evaluateHamiltonianTheorems(graph);
    const hamiltonian = findHamiltonian(graph);
    const laplacian = computeLaplacian(graph);
    const matrixPower2 = computeMatrixPower(graph, 2);

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        ...baseAnalysis,
        euler: {
          ...eulerAnalysis,
          sampleTrail: eulerTrail ? eulerTrail.path : null
        },
        hamiltonian: {
          theorems: hamiltonTheorems,
          hasCycle: hamiltonian.hasCycle,
          hasPath: hamiltonian.hasPath,
          sampleCycle: hamiltonian.hamiltonianCycle,
          samplePath: hamiltonian.hamiltonianPath,
          allCycleCount: hamiltonian.allCycles.length
        },
        laplacian,
        walksOfLength2: matrixPower2
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Graph analysis error: ' + err.message });
  }
});

/**
 * POST /api/graph/bfs
 * Step-by-step BFS Traversal
 */
router.post('/bfs', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const { startVertex } = req.body;
    const start = startVertex || graph.getVertices()[0];

    if (!start || !graph.hasVertex(start)) {
      return res.status(400).json({ error: `Start vertex "${start}" does not exist in graph.` });
    }

    const result = bfs(graph, start);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/graph/dfs
 * Step-by-step DFS Traversal
 */
router.post('/dfs', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const { startVertex } = req.body;
    const start = startVertex || graph.getVertices()[0];

    if (!start || !graph.hasVertex(start)) {
      return res.status(400).json({ error: `Start vertex "${start}" does not exist in graph.` });
    }

    const result = dfs(graph, start);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/graph/euler
 * Hierholzer's Algorithm Execution
 */
router.post('/euler', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const { startVertex } = req.body;
    const analysis = analyzeEulerianProperties(graph);
    const trail = findEulerTrail(graph, startVertex);

    return res.json({
      success: true,
      analysis,
      trail
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/graph/hamilton
 * Backtracking Hamiltonian Search & Dirac/Ore Verification
 */
router.post('/hamilton', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const { startVertex } = req.body;
    const theorems = evaluateHamiltonianTheorems(graph);
    const result = findHamiltonian(graph, startVertex);

    return res.json({
      success: true,
      theorems,
      result
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/graph/matrix-power
 * Compute Matrix Power A^k
 */
router.post('/matrix-power', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const k = Math.max(1, Math.min(parseInt(req.body.k, 10) || 2, 5));
    const result = computeMatrixPower(graph, k);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/graph/validate-walk
 * Validates a player's path/trail/euler/hamilton sequence
 */
router.post('/validate-walk', parseGraphBody, (req, res) => {
  try {
    const graph = req.graph;
    const { walk, type } = req.body;

    if (!Array.isArray(walk)) {
      return res.status(400).json({ error: 'Walk must be an array of vertex names.' });
    }

    let validationResult;
    switch (type) {
      case 'EULER_PATH':
        validationResult = validateEulerWalk(graph, walk, 'PATH');
        break;
      case 'EULER_CIRCUIT':
        validationResult = validateEulerWalk(graph, walk, 'CIRCUIT');
        break;
      case 'HAMILTON_PATH':
        validationResult = validateHamiltonWalk(graph, walk, 'PATH');
        break;
      case 'HAMILTON_CYCLE':
        validationResult = validateHamiltonWalk(graph, walk, 'CYCLE');
        break;
      case 'PATH': {
        // Simple path verification
        const seen = new Set();
        let valid = true;
        let reason = 'Valid Simple Path.';
        for (let i = 0; i < walk.length; i++) {
          const v = walk[i];
          if (!graph.hasVertex(v)) {
            valid = false;
            reason = `Vertex '${v}' does not exist in graph.`;
            break;
          }
          if (seen.has(v)) {
            valid = false;
            reason = `Simple Path violation: Vertex '${v}' was visited more than once.`;
            break;
          }
          seen.add(v);
          if (i > 0 && !graph.hasEdge(walk[i - 1], v)) {
            valid = false;
            reason = `No edge exists between '${walk[i - 1]}' and '${v}'.`;
            break;
          }
        }
        validationResult = { isValid: valid, reason };
        break;
      }
      case 'CYCLE': {
        // Simple cycle verification
        let valid = true;
        let reason = 'Valid Simple Cycle.';
        if (walk.length < 4 || walk[0] !== walk[walk.length - 1]) {
          valid = false;
          reason = 'Cycle must start and end at the same vertex and have at least 3 distinct vertices.';
        } else {
          const inner = walk.slice(0, walk.length - 1);
          const seen = new Set(inner);
          if (seen.size !== inner.length) {
            valid = false;
            reason = 'Cycle intermediate vertices must be distinct.';
          } else {
            for (let i = 0; i < walk.length - 1; i++) {
              if (!graph.hasEdge(walk[i], walk[i + 1])) {
                valid = false;
                reason = `No edge exists between '${walk[i]}' and '${walk[i + 1]}'.`;
                break;
              }
            }
          }
        }
        validationResult = { isValid: valid, reason };
        break;
      }
      default:
        validationResult = { isValid: true, reason: 'Walk accepted.' };
    }

    return res.json({ success: true, validation: validationResult });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/graph/preset
 * Generate standard preset topologies
 */
router.post('/preset', (req, res) => {
  try {
    const { preset, n, m, p } = req.body;
    let graph;
    switch (preset) {
      case 'complete':
        graph = GraphGenerator.complete(n || 5);
        break;
      case 'cycle':
        graph = GraphGenerator.cycle(n || 5);
        break;
      case 'path':
        graph = GraphGenerator.path(n || 5);
        break;
      case 'star':
        graph = GraphGenerator.star(n || 6);
        break;
      case 'bipartite':
        graph = GraphGenerator.bipartite(m || 3, n || 3);
        break;
      case 'petersen':
        graph = GraphGenerator.petersen();
        break;
      case 'koenigsberg':
        graph = GraphGenerator.koenigsberg();
        break;
      case 'random':
      default:
        graph = GraphGenerator.random(n || 6, p || 0.4);
        break;
    }

    return res.json({
      success: true,
      preset,
      graph: graph.toJSON()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

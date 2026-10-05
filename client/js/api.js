/**
 * GraphQuest - Client API Service
 * Discrete Mathematics (7MA206)
 */

const API_BASE = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173')
  ? 'http://localhost:3000/api'
  : '/api';

export const ApiService = {
  /**
   * Health Check
   */
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  /**
   * Load all worlds and levels
   */
  async getLevels() {
    const res = await fetch(`${API_BASE}/game/levels`);
    return res.json();
  },

  /**
   * Load specific level data
   */
  async getLevelById(levelId) {
    const res = await fetch(`${API_BASE}/game/levels/${levelId}`);
    return res.json();
  },

  /**
   * Validate level answer
   */
  async validateLevelAnswer(levelId, answer) {
    const res = await fetch(`${API_BASE}/game/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelId, answer })
    });
    return res.json();
  },

  /**
   * Full Mathematical Analysis of arbitrary graph
   */
  async analyzeGraph(graphData) {
    const res = await fetch(`${API_BASE}/graph/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphData)
    });
    return res.json();
  },

  /**
   * Run BFS traversal with step-by-step trace
   */
  async runBFS(graphData, startVertex) {
    const res = await fetch(`${API_BASE}/graph/bfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...graphData, startVertex })
    });
    return res.json();
  },

  /**
   * Run DFS traversal with step-by-step trace
   */
  async runDFS(graphData, startVertex) {
    const res = await fetch(`${API_BASE}/graph/dfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...graphData, startVertex })
    });
    return res.json();
  },

  /**
   * Run Euler Hierholzer with step-by-step trace
   */
  async runEuler(graphData, startVertex) {
    const res = await fetch(`${API_BASE}/graph/euler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...graphData, startVertex })
    });
    return res.json();
  },

  /**
   * Run Hamiltonian backtracking solver
   */
  async runHamilton(graphData, startVertex) {
    const res = await fetch(`${API_BASE}/graph/hamilton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...graphData, startVertex })
    });
    return res.json();
  },

  /**
   * Compute Matrix Power A^k
   */
  async computeMatrixPower(graphData, k = 2) {
    const res = await fetch(`${API_BASE}/graph/matrix-power`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...graphData, k })
    });
    return res.json();
  },

  /**
   * Load Topology Preset
   */
  async loadPreset(preset, n, m, p) {
    const res = await fetch(`${API_BASE}/graph/preset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset, n, m, p })
    });
    return res.json();
  }
};

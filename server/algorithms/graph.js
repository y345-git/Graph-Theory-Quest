/**
 * GraphQuest - Core Graph Data Structure & Mathematical Formulations
 * Discrete Mathematics (7MA206) - Module 1: Graph Theory Fundamentals
 */

class Graph {
  /**
   * @param {boolean} isDirected Whether graph is directed (default: false)
   */
  constructor(isDirected = false) {
    this.isDirected = isDirected;
    /** @type {Set<string>} */
    this.vertices = new Set();
    /** @type {Map<string, Set<string>>} */
    this.adjacencyList = new Map();
    /** @type {Array<[string, string]>} */
    this.edges = [];
  }

  /**
   * Add a vertex v to V(G)
   * @param {string} vertex
   * @returns {boolean} True if added, false if already exists
   */
  addVertex(vertex) {
    if (!vertex || typeof vertex !== 'string') return false;
    const v = vertex.trim();
    if (v.length === 0) return false;
    if (this.vertices.has(v)) return false;

    this.vertices.add(v);
    this.adjacencyList.set(v, new Set());
    return true;
  }

  /**
   * Remove a vertex v from V(G) and all incident edges
   * @param {string} vertex
   * @returns {boolean}
   */
  removeVertex(vertex) {
    if (!this.vertices.has(vertex)) return false;

    // Remove all incident edges
    this.edges = this.edges.filter(
      ([u, v]) => u !== vertex && v !== vertex
    );

    // Remove from neighbors' adjacency sets
    for (const [v, neighbors] of this.adjacencyList.entries()) {
      neighbors.delete(vertex);
    }

    this.adjacencyList.delete(vertex);
    this.vertices.delete(vertex);
    return true;
  }

  /**
   * Add an edge (u, v) to E(G)
   * @param {string} u Source vertex
   * @param {string} v Target vertex
   * @returns {boolean}
   */
  addEdge(u, v) {
    if (!u || !v) return false;
    u = u.trim();
    v = v.trim();

    // Ensure vertices exist
    if (!this.vertices.has(u)) this.addVertex(u);
    if (!this.vertices.has(v)) this.addVertex(v);

    // Check duplicate edge for undirected graph
    if (!this.isDirected) {
      if (this.hasEdge(u, v) || this.hasEdge(v, u)) {
        return false;
      }
      this.edges.push([u, v]);
      this.adjacencyList.get(u).add(v);
      if (u !== v) {
        this.adjacencyList.get(v).add(u);
      }
    } else {
      if (this.hasEdge(u, v)) return false;
      this.edges.push([u, v]);
      this.adjacencyList.get(u).add(v);
    }
    return true;
  }

  /**
   * Remove edge (u, v) from E(G)
   * @param {string} u
   * @param {string} v
   * @returns {boolean}
   */
  removeEdge(u, v) {
    if (!this.hasEdge(u, v)) return false;

    if (!this.isDirected) {
      this.edges = this.edges.filter(
        ([a, b]) => !( (a === u && b === v) || (a === v && b === u) )
      );
      if (this.adjacencyList.has(u)) this.adjacencyList.get(u).delete(v);
      if (this.adjacencyList.has(v)) this.adjacencyList.get(v).delete(u);
    } else {
      this.edges = this.edges.filter(([a, b]) => !(a === u && b === v));
      if (this.adjacencyList.has(u)) this.adjacencyList.get(u).delete(v);
    }
    return true;
  }

  /**
   * Check if vertex exists in V(G)
   * @param {string} vertex
   * @returns {boolean}
   */
  hasVertex(vertex) {
    return this.vertices.has(vertex);
  }

  /**
   * Check if edge (u, v) exists in E(G)
   * @param {string} u
   * @param {string} v
   * @returns {boolean}
   */
  hasEdge(u, v) {
    if (!this.isDirected) {
      return this.edges.some(
        ([a, b]) => (a === u && b === v) || (a === v && b === u)
      );
    }
    return this.edges.some(([a, b]) => a === u && b === v);
  }

  /**
   * Get sorted array of vertices
   * @returns {string[]}
   */
  getVertices() {
    return Array.from(this.vertices).sort();
  }

  /**
   * Get list of edges
   * @returns {Array<[string, string]>}
   */
  getEdges() {
    return [...this.edges];
  }

  /**
   * Get adjacent neighbors of vertex v
   * @param {string} vertex
   * @returns {string[]}
   */
  getNeighbors(vertex) {
    if (!this.vertices.has(vertex)) return [];
    return Array.from(this.adjacencyList.get(vertex) || []).sort();
  }

  /**
   * Calculate degree of vertex v: deg(v) = |{e in E | v in e}|
   * Handles self-loops (contributes +2 to degree in undirected graph)
   * @param {string} vertex
   * @returns {number}
   */
  getDegree(vertex) {
    if (!this.vertices.has(vertex)) return 0;
    if (this.isDirected) {
      return this.getInDegree(vertex) + this.getOutDegree(vertex);
    }
    let deg = 0;
    for (const [u, v] of this.edges) {
      if (u === vertex && v === vertex) {
        deg += 2; // Handshaking lemma: self-loop adds 2 to degree
      } else if (u === vertex || v === vertex) {
        deg += 1;
      }
    }
    return deg;
  }

  getInDegree(vertex) {
    if (!this.vertices.has(vertex)) return 0;
    return this.edges.filter(([_, v]) => v === vertex).length;
  }

  getOutDegree(vertex) {
    if (!this.vertices.has(vertex)) return 0;
    return this.edges.filter(([u, _]) => u === vertex).length;
  }

  /**
   * Degree sequence: non-increasing order of vertex degrees
   * @returns {number[]}
   */
  getDegreeSequence() {
    return this.getVertices()
      .map(v => this.getDegree(v))
      .sort((a, b) => b - a);
  }

  /**
   * Handshaking Lemma Verification:
   * Sum of degrees = 2 * |E|
   * @returns {{ sumOfDegrees: number, twiceEdges: number, edgeCount: number, holds: boolean, explanation: string }}
   */
  getHandshakingLemma() {
    const vertices = this.getVertices();
    const degreeMap = {};
    let sumOfDegrees = 0;

    for (const v of vertices) {
      const d = this.getDegree(v);
      degreeMap[v] = d;
      sumOfDegrees += d;
    }

    const edgeCount = this.edges.length;
    const twiceEdges = 2 * edgeCount;
    const holds = sumOfDegrees === twiceEdges;

    const explanation = `\\sum_{v \\in V} \\deg(v) = ${sumOfDegrees} = 2 \\cdot |E| = 2 \\cdot ${edgeCount} = ${twiceEdges}. ` +
      `Handshaking Lemma ${holds ? 'HOLDS' : 'FAILS'}. Corollary: The number of odd-degree vertices must always be even.`;

    const oddVertices = vertices.filter(v => degreeMap[v] % 2 !== 0);
    const evenVertices = vertices.filter(v => degreeMap[v] % 2 === 0);

    return {
      sumOfDegrees,
      twiceEdges,
      edgeCount,
      holds,
      degreeMap,
      oddVertices,
      evenVertices,
      oddCount: oddVertices.length,
      evenCount: evenVertices.length,
      explanation
    };
  }

  /**
   * Get minimum degree delta(G) and maximum degree Delta(G)
   * @returns {{ minDegree: number, maxDegree: number, isRegular: boolean, regularDegree: number|null }}
   */
  getDegreeExtremes() {
    const vertices = this.getVertices();
    if (vertices.length === 0) {
      return { minDegree: 0, maxDegree: 0, isRegular: true, regularDegree: 0 };
    }
    const degrees = vertices.map(v => this.getDegree(v));
    const minDegree = Math.min(...degrees);
    const maxDegree = Math.max(...degrees);
    const isRegular = minDegree === maxDegree;

    return {
      minDegree,
      maxDegree,
      isRegular,
      regularDegree: isRegular ? minDegree : null
    };
  }

  /**
   * Construct the Adjacency Matrix A(G)
   * A_ij = 1 if (v_i, v_j) in E, else 0
   * @returns {{ matrix: number[][], vertexOrder: string[] }}
   */
  getAdjacencyMatrix() {
    const vertexOrder = this.getVertices();
    const n = vertexOrder.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    const indexMap = new Map();
    vertexOrder.forEach((v, idx) => indexMap.set(v, idx));

    for (const [u, v] of this.edges) {
      const i = indexMap.get(u);
      const j = indexMap.get(v);
      if (i !== undefined && j !== undefined) {
        matrix[i][j] = 1;
        if (!this.isDirected) {
          matrix[j][i] = 1;
        }
      }
    }

    return { matrix, vertexOrder };
  }

  /**
   * Construct Incidence Matrix M(G)
   * For undirected graph: M_ie = 1 if v_i is incident to edge e, 2 if self-loop, else 0
   * @returns {{ matrix: number[][], vertexOrder: string[], edgeOrder: string[] }}
   */
  getIncidenceMatrix() {
    const vertexOrder = this.getVertices();
    const edgeOrder = this.edges.map(([u, v]) => `${u}-${v}`);
    const n = vertexOrder.length;
    const m = this.edges.length;

    const matrix = Array.from({ length: n }, () => Array(m).fill(0));
    const vMap = new Map();
    vertexOrder.forEach((v, idx) => vMap.set(v, idx));

    this.edges.forEach(([u, v], eIdx) => {
      const uIdx = vMap.get(u);
      const vIdx = vMap.get(v);
      if (uIdx !== undefined && vIdx !== undefined) {
        if (uIdx === vIdx) {
          matrix[uIdx][eIdx] = 2; // Loop
        } else {
          matrix[uIdx][eIdx] = 1;
          matrix[vIdx][eIdx] = 1;
        }
      }
    });

    return { matrix, vertexOrder, edgeOrder };
  }

  /**
   * Find all connected components using Breadth-First Search
   * @returns {Array<string[]>} Array of component vertex lists
   */
  getConnectedComponents() {
    const vertices = this.getVertices();
    const visited = new Set();
    const components = [];

    for (const vertex of vertices) {
      if (!visited.has(vertex)) {
        const comp = [];
        const queue = [vertex];
        visited.add(vertex);

        while (queue.length > 0) {
          const curr = queue.shift();
          comp.push(curr);

          for (const neighbor of this.getNeighbors(curr)) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        }
        components.push(comp.sort());
      }
    }

    return components;
  }

  /**
   * Check if the graph is connected: k(G) = 1
   * Special case: empty graph is vacuously considered 0 components.
   * @returns {boolean}
   */
  isConnected() {
    const vertices = this.getVertices();
    if (vertices.length <= 1) return true;
    const components = this.getConnectedComponents();
    return components.length === 1;
  }

  /**
   * Find isolated vertices (deg(v) = 0)
   * @returns {string[]}
   */
  getIsolatedVertices() {
    return this.getVertices().filter(v => this.getDegree(v) === 0);
  }

  /**
   * Find pendant (leaf) vertices (deg(v) = 1)
   * @returns {string[]}
   */
  getPendantVertices() {
    return this.getVertices().filter(v => this.getDegree(v) === 1);
  }

  /**
   * Complete mathematical analysis of the graph
   */
  analyze() {
    const vertices = this.getVertices();
    const edges = this.getEdges();
    const n = vertices.length;
    const m = edges.length;

    const components = this.getConnectedComponents();
    const handshaking = this.getHandshakingLemma();
    const extremes = this.getDegreeExtremes();
    const isolated = this.getIsolatedVertices();
    const pendants = this.getPendantVertices();
    const { matrix, vertexOrder } = this.getAdjacencyMatrix();

    // Max possible edges for simple undirected graph: n(n-1)/2
    const maxEdges = n > 1 ? (n * (n - 1)) / 2 : 0;
    const density = maxEdges > 0 ? Number((m / maxEdges).toFixed(3)) : 0;
    const isComplete = n > 0 && m === maxEdges && !this.edges.some(([u, v]) => u === v);

    return {
      order: n, // |V|
      size: m,  // |E|
      vertices,
      edges,
      isConnected: this.isConnected(),
      componentCount: components.length,
      components,
      isolatedVertices: isolated,
      pendantVertices: pendants,
      handshaking,
      minDegree: extremes.minDegree,
      maxDegree: extremes.maxDegree,
      isRegular: extremes.isRegular,
      regularDegree: extremes.regularDegree,
      degreeSequence: this.getDegreeSequence(),
      density,
      isComplete,
      adjacencyMatrix: matrix,
      vertexOrder
    };
  }

  /**
   * Serializes graph to JSON
   */
  toJSON() {
    return {
      isDirected: this.isDirected,
      vertices: this.getVertices(),
      edges: this.getEdges()
    };
  }

  /**
   * Deserializes graph from JSON
   * @param {{ vertices: string[], edges: Array<[string, string]>, isDirected?: boolean }} data
   * @returns {Graph}
   */
  static fromJSON(data) {
    if (!data) return new Graph();
    const g = new Graph(Boolean(data.isDirected));
    if (Array.isArray(data.vertices)) {
      data.vertices.forEach(v => g.addVertex(String(v)));
    }
    if (Array.isArray(data.edges)) {
      data.edges.forEach(e => {
        if (Array.isArray(e) && e.length >= 2) {
          g.addEdge(String(e[0]), String(e[1]));
        }
      });
    }
    return g;
  }
}

module.exports = Graph;

/**
 * GraphQuest - Client-Side Graph Model
 * Discrete Mathematics (7MA206)
 */

export class Graph {
  constructor(isDirected = false) {
    this.isDirected = isDirected;
    this.vertices = new Set();
    this.adjacencyList = new Map();
    this.edges = [];
    this.positions = new Map(); // { x, y }
  }

  addVertex(vertex, position = null) {
    if (!vertex) return false;
    const v = String(vertex).trim();
    if (this.vertices.has(v)) return false;

    this.vertices.add(v);
    this.adjacencyList.set(v, new Set());
    if (position) {
      this.positions.set(v, { ...position });
    }
    return true;
  }

  removeVertex(vertex) {
    if (!this.vertices.has(vertex)) return false;
    this.edges = this.edges.filter(([u, v]) => u !== vertex && v !== vertex);
    for (const [_, neighbors] of this.adjacencyList.entries()) {
      neighbors.delete(vertex);
    }
    this.adjacencyList.delete(vertex);
    this.positions.delete(vertex);
    this.vertices.delete(vertex);
    return true;
  }

  addEdge(u, v) {
    u = String(u).trim();
    v = String(v).trim();
    if (!this.vertices.has(u)) this.addVertex(u);
    if (!this.vertices.has(v)) this.addVertex(v);

    if (!this.isDirected) {
      if (this.hasEdge(u, v) || this.hasEdge(v, u)) return false;
      this.edges.push([u, v]);
      this.adjacencyList.get(u).add(v);
      if (u !== v) this.adjacencyList.get(v).add(u);
    } else {
      if (this.hasEdge(u, v)) return false;
      this.edges.push([u, v]);
      this.adjacencyList.get(u).add(v);
    }
    return true;
  }

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

  hasVertex(vertex) {
    return this.vertices.has(vertex);
  }

  hasEdge(u, v) {
    if (!this.isDirected) {
      return this.edges.some(
        ([a, b]) => (a === u && b === v) || (a === v && b === u)
      );
    }
    return this.edges.some(([a, b]) => a === u && b === v);
  }

  getVertices() {
    return Array.from(this.vertices).sort();
  }

  getEdges() {
    return [...this.edges];
  }

  getNeighbors(vertex) {
    if (!this.vertices.has(vertex)) return [];
    return Array.from(this.adjacencyList.get(vertex) || []).sort();
  }

  getDegree(vertex) {
    if (!this.vertices.has(vertex)) return 0;
    let deg = 0;
    for (const [u, v] of this.edges) {
      if (u === vertex && v === vertex) deg += 2;
      else if (u === vertex || v === vertex) deg += 1;
    }
    return deg;
  }

  setPosition(vertex, x, y) {
    if (this.vertices.has(vertex)) {
      this.positions.set(vertex, { x, y });
    }
  }

  getPosition(vertex) {
    return this.positions.get(vertex) || { x: 300, y: 200 };
  }

  clear() {
    this.vertices.clear();
    this.adjacencyList.clear();
    this.edges = [];
    this.positions.clear();
  }

  toJSON() {
    const posObj = {};
    for (const [v, p] of this.positions.entries()) {
      posObj[v] = p;
    }
    return {
      isDirected: this.isDirected,
      vertices: this.getVertices(),
      edges: this.getEdges(),
      positions: posObj
    };
  }

  static fromJSON(data) {
    const g = new Graph(Boolean(data?.isDirected));
    if (!data) return g;
    if (Array.isArray(data.vertices)) {
      data.vertices.forEach(v => {
        const pos = data.positions ? data.positions[v] : null;
        g.addVertex(v, pos);
      });
    }
    if (Array.isArray(data.edges)) {
      data.edges.forEach(e => {
        if (Array.isArray(e) && e.length >= 2) {
          g.addEdge(e[0], e[1]);
        }
      });
    }
    return g;
  }
}

/**
 * GraphQuest - Graph Generator for Standard Topologies & Random Graphs
 * Discrete Mathematics (7MA206) - Module 6: Graph Families & Topologies
 */

const Graph = require('./graph');

/**
 * Generate standard mathematical graph topologies
 */
const GraphGenerator = {
  /**
   * Complete Graph K_n
   */
  complete(n = 5) {
    const g = new Graph();
    const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, n).split('');
    names.forEach(v => g.addVertex(v));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        g.addEdge(names[i], names[j]);
      }
    }
    return g;
  },

  /**
   * Cycle Graph C_n
   */
  cycle(n = 5) {
    const g = new Graph();
    const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, n).split('');
    names.forEach(v => g.addVertex(v));
    for (let i = 0; i < n; i++) {
      g.addEdge(names[i], names[(i + 1) % n]);
    }
    return g;
  },

  /**
   * Path Graph P_n
   */
  path(n = 5) {
    const g = new Graph();
    const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, n).split('');
    names.forEach(v => g.addVertex(v));
    for (let i = 0; i < n - 1; i++) {
      g.addEdge(names[i], names[i + 1]);
    }
    return g;
  },

  /**
   * Star Graph S_n (1 center + n-1 leaves)
   */
  star(n = 6) {
    const g = new Graph();
    const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, n).split('');
    names.forEach(v => g.addVertex(v));
    const center = names[0];
    for (let i = 1; i < n; i++) {
      g.addEdge(center, names[i]);
    }
    return g;
  },

  /**
   * Complete Bipartite Graph K_{m,n}
   */
  bipartite(m = 3, n = 3) {
    const g = new Graph();
    const setA = Array.from({ length: m }, (_, i) => `A${i + 1}`);
    const setB = Array.from({ length: n }, (_, i) => `B${i + 1}`);

    setA.forEach(v => g.addVertex(v));
    setB.forEach(v => g.addVertex(v));

    for (const u of setA) {
      for (const v of setB) {
        g.addEdge(u, v);
      }
    }
    return g;
  },

  /**
   * The Famous Petersen Graph (10 vertices, 15 edges, 3-regular, non-Hamiltonian)
   */
  petersen() {
    const g = new Graph();
    const outer = ['A', 'B', 'C', 'D', 'E'];
    const inner = ['F', 'G', 'H', 'I', 'J'];

    [...outer, ...inner].forEach(v => g.addVertex(v));

    // Outer cycle: A-B-C-D-E-A
    for (let i = 0; i < 5; i++) {
      g.addEdge(outer[i], outer[(i + 1) % 5]);
    }

    // Inner star: F-H-J-G-I-F
    g.addEdge('F', 'H');
    g.addEdge('H', 'J');
    g.addEdge('J', 'G');
    g.addEdge('G', 'I');
    g.addEdge('I', 'F');

    // Spokes connecting outer to inner
    for (let i = 0; i < 5; i++) {
      g.addEdge(outer[i], inner[i]);
    }

    return g;
  },

  /**
   * Königsberg Bridges (Euler 1736 historic graph)
   * 4 landmasses (A, B, C, D) with 7 bridges (represented with multigraph mapped to simple equivalent or key vertices)
   */
  koenigsberg() {
    const g = new Graph();
    ['NorthBank', 'SouthBank', 'IslandA', 'IslandB'].forEach(v => g.addVertex(v));
    g.addEdge('NorthBank', 'IslandA');
    g.addEdge('NorthBank', 'IslandB');
    g.addEdge('SouthBank', 'IslandA');
    g.addEdge('SouthBank', 'IslandB');
    g.addEdge('IslandA', 'IslandB');
    return g;
  },

  /**
   * Random Erdős-Rényi Graph G(n, p)
   */
  random(n = 6, p = 0.4) {
    const g = new Graph();
    const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, Math.min(n, 26)).split('');
    names.forEach(v => g.addVertex(v));

    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        if (Math.random() < p) {
          g.addEdge(names[i], names[j]);
        }
      }
    }
    return g;
  }
};

module.exports = GraphGenerator;

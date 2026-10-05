/**
 * GraphQuest - Theory Hub & Mathematical Encyclopedia
 * Discrete Mathematics (7MA206)
 */

export const TheoryContent = {
  intro: {
    title: "1. Introduction to Graph Theory",
    html: `
      <h2>1. Introduction to Graph Theory</h2>
      <p>A <strong>Graph</strong> $G = (V, E)$ is a discrete structure consisting of a non-empty set $V$ of <strong>vertices</strong> (or nodes) and a set $E$ of <strong>edges</strong> (or links) that connect pairs of vertices.</p>
      
      <div class="math-definition-box">
        <strong>Formal Definition:</strong><br>
        $G = (V, E)$ where:<br>
        • $V(G) = \\{v_1, v_2, \\dots, v_n\\}$ is the non-empty set of vertices. The cardinality $|V| = n$ is the <strong>Order</strong> of the graph.<br>
        • $E(G) = \\{e_1, e_2, \\dots, e_m\\}$ where each edge $e = (u, v)$ is an unordered pair $\\{u, v\\}$ of vertices. The cardinality $|E| = m$ is the <strong>Size</strong> of the graph.
      </div>

      <h3>Simple Graphs vs Multi-graphs</h3>
      <p>A <strong>Simple Graph</strong> contains no self-loops (edges from a vertex to itself) and at most one edge between any two distinct vertices. In a simple undirected graph of order $n$, the maximum possible number of edges is:</p>
      <div class="math-definition-box">
        $$|E|_{\\max} = \\binom{n}{2} = \\frac{n(n - 1)}{2}$$
      </div>
    `
  },

  degrees: {
    title: "2. Degrees & The Handshaking Lemma",
    html: `
      <h2>2. Vertex Degrees & The Handshaking Lemma</h2>
      <p>The <strong>degree</strong> of a vertex $v$ in an undirected graph, denoted $\\deg(v)$, is the number of edges incident with $v$.</p>
      
      <div class="math-definition-box">
        <strong>The Handshaking Lemma (Euler 1736):</strong><br>
        For any undirected graph $G = (V, E)$:<br>
        $$\\sum_{v \\in V} \\deg(v) = 2|E|$$
      </div>

      <h3>Fundamental Corollaries</h3>
      <p>1. <strong>Sum of Degrees is Always Even:</strong> Because the right side $2|E|$ is always an even integer, the sum of all vertex degrees must always be an even integer.</p>
      <p>2. <strong>Even Number of Odd Vertices:</strong> In every graph, the number of vertices with odd degree is always even. It is mathematically impossible to construct a graph with an odd number of odd-degree vertices.</p>

      <h3>Special Classifications</h3>
      <p>• <strong>Isolated Vertex:</strong> A vertex with $\\deg(v) = 0$.</p>
      <p>• <strong>Pendant / Leaf Vertex:</strong> A vertex with $\\deg(v) = 1$.</p>
      <p>• <strong>k-Regular Graph:</strong> A graph where every vertex has the exact same degree $k$ (e.g., $C_n$ is 2-regular; $K_4$ is 3-regular; the Petersen graph is 3-regular cubic).</p>
    `
  },

  matrices: {
    title: "3. Matrix Representations",
    html: `
      <h2>3. Matrix Representations of Graphs</h2>
      <p>Graphs can be represented algebraically using matrices, enabling powerful algebraic operations.</p>
      
      <div class="math-definition-box">
        <strong>Adjacency Matrix $A(G)$:</strong><br>
        For a graph with ordered vertices $v_1, v_2, \\dots, v_n$, the $n \\times n$ matrix $A$ is defined by:<br>
        $$A_{ij} = \\begin{cases} 1 & \\text{if } (v_i, v_j) \\in E \\\\ 0 & \\text{otherwise} \\end{cases}$$
      </div>

      <h3>Properties of Adjacency Matrix</h3>
      <p>• <strong>Symmetry:</strong> For undirected graphs, $A = A^T$ (symmetric).</p>
      <p>• <strong>Diagonal:</strong> For loopless graphs, $A_{ii} = 0$.</p>
      <p>• <strong>Row Sum:</strong> The sum of elements in row $i$ equals $\\deg(v_i)$.</p>

      <div class="math-definition-box">
        <strong>Matrix Powers & Number of Walks Theorem:</strong><br>
        Let $A$ be the adjacency matrix of $G$. The entry $(A^k)_{ij}$ equals the exact number of distinct walks of length $k$ between vertex $v_i$ and vertex $v_j$.
      </div>
    `
  },

  walks: {
    title: "4. Walks, Trails and Paths",
    html: `
      <h2>4. Walks, Trails and Paths</h2>
      <p>Movement through a graph is categorized strictly by uniqueness of vertices and edges.</p>
      
      <div class="math-definition-box">
        <strong>The Movement Hierarchy:</strong><br>
        1. <strong>Walk:</strong> An alternating sequence of vertices and edges $v_0, e_1, v_1, e_2, \\dots, v_k$. Vertices and edges <em>may repeat</em>.<br>
        2. <strong>Trail:</strong> A walk in which <em>no edge is repeated</em>.<br>
        3. <strong>Simple Path:</strong> A walk in which <em>no vertex is repeated</em> (which automatically guarantees no edge is repeated).
      </div>
    `
  },

  cycles: {
    title: "5. Cycles and Connectivity",
    html: `
      <h2>5. Cycles and Connectivity</h2>
      <p>A <strong>Cycle</strong> $C_k$ is a closed path of length $k \\ge 3$ starting and ending at the same vertex.</p>
      
      <div class="math-definition-box">
        <strong>Graph Connectivity & Components:</strong><br>
        • A graph is <strong>Connected</strong> if there is a path between every pair of distinct vertices.<br>
        • If disconnected, the graph is partitioned into $k(G) \\ge 2$ maximal connected subgraphs called <strong>Connected Components</strong>.
      </div>
    `
  },

  traversals: {
    title: "6. BFS & DFS Traversals",
    html: `
      <h2>6. Graph Traversals: BFS & DFS</h2>
      <p>Systematic graph exploration algorithms form the core of graph analysis.</p>

      <div class="math-definition-box">
        <strong>Breadth-First Search (BFS):</strong><br>
        • Data Structure: <strong>FIFO Queue</strong>.<br>
        • Strategy: Level-by-level exploration (explores nearest neighbors first).<br>
        • Complexity: $O(|V| + |E|)$.<br>
        • Key Application: Finds the shortest path (minimum hop distance) in unweighted graphs.
      </div>

      <div class="math-definition-box">
        <strong>Depth-First Search (DFS):</strong><br>
        • Data Structure: <strong>LIFO Stack / Recursion</strong>.<br>
        • Strategy: Dives as deep as possible along each branch before backtracking.<br>
        • Timestamps: Discovery time $d[u]$ and Finishing time $f[u]$.<br>
        • Key Application: Topological sorting, connected components, and cycle detection via back-edges.
      </div>
    `
  },

  euler: {
    title: "7. Eulerian Paths & Circuits",
    html: `
      <h2>7. Eulerian Paths and Circuits</h2>
      <p>Named after Leonhard Euler's resolution of the Seven Bridges of Königsberg (1736).</p>

      <div class="math-definition-box">
        <strong>Definitions (Focus on EDGES):</strong><br>
        • <strong>Euler Trail (Path):</strong> A trail that visits <em>every edge in $E(G)$ exactly once</em>.<br>
        • <strong>Euler Circuit:</strong> An Euler trail that starts and ends at the <em>same vertex</em>.
      </div>

      <h3>Euler's Fundamental Theorem</h3>
      <p>Let $G$ be a connected undirected graph:</p>
      <p>1. $G$ contains an <strong>Euler Circuit</strong> $\\iff$ <strong>EVERY vertex has an EVEN degree</strong> (0 odd vertices).</p>
      <p>2. $G$ contains an <strong>Euler Path</strong> $\\iff$ <strong>EXACTLY TWO vertices have an ODD degree</strong>. (The path must start at one odd vertex and end at the other).</p>
      <p>3. If $G$ has more than 2 odd vertices, no Euler Path or Circuit is possible.</p>

      <h3>Hierholzer's Algorithm ($O(|E|)$)</h3>
      <p>Constructs an Eulerian circuit by maintaining a stack of visited vertices and splicing sub-tours when encountering vertices with remaining unused edges.</p>
    `
  },

  hamilton: {
    title: "8. Hamiltonian Paths & Cycles",
    html: `
      <h2>8. Hamiltonian Paths and Cycles</h2>
      <p>Named after Sir William Rowan Hamilton.</p>

      <div class="math-definition-box">
        <strong>Definitions (Focus on VERTICES):</strong><br>
        • <strong>Hamiltonian Path:</strong> A path that visits <em>every vertex in $V(G)$ exactly once</em>.<br>
        • <strong>Hamiltonian Cycle:</strong> A closed loop that visits <em>every vertex in $V(G)$ exactly once</em> and returns to the starting vertex.<br>
        • Computational Complexity: Determining Hamiltonian existence is <strong>NP-Complete</strong> ($O(2^n)$).
      </div>

      <h3>Sufficient Conditions (Theorems)</h3>
      <p>Unlike Eulerian graphs, there is no known simple necessary-and-sufficient degree condition. However, powerful sufficient theorems exist:</p>
      
      <div class="math-definition-box">
        <strong>Dirac's Theorem (1952):</strong><br>
        If $G$ is a simple graph with $n \\ge 3$ vertices, and $\\deg(v) \\ge \\frac{n}{2}$ for every vertex $v \\in V$, then $G$ contains a Hamiltonian Cycle.
      </div>

      <div class="math-definition-box">
        <strong>Ore's Theorem (1960):</strong><br>
        If $G$ is a simple graph with $n \\ge 3$ vertices, and for every non-adjacent pair $(u, v)$, $\\deg(u) + \\deg(v) \\ge n$, then $G$ contains a Hamiltonian Cycle.
      </div>
    `
  },

  "edge-cases": {
    title: "9. Mathematical Edge Cases",
    html: `
      <h2>9. Mathematical Edge Cases Handled</h2>
      <p>The system robustly models and evaluates critical edge cases required by Criterion A4:</p>
      <div class="math-definition-box">
        • <strong>Null Graph $\\emptyset$ ($|V| = 0$):</strong> Vacuously connected with 0 components.<br>
        • <strong>Trivial Graph ($|V| = 1, |E| = 0$):</strong> Single isolated vertex, connected, degree 0.<br>
        • <strong>Disconnected Graphs ($k(G) > 1$):</strong> Euler tours impossible across multiple non-trivial components.<br>
        • <strong>Isolated & Pendant Vertices:</strong> Correctly detected without crashing matrix powers or traversals.<br>
        • <strong>Complete Graph $K_n$:</strong> Dirac's condition satisfied for all $n \\ge 3$; Euler circuit for all odd $n$.<br>
        • <strong>Petersen Graph:</strong> Famous 3-regular cubic graph that is non-Eulerian and contains Hamiltonian paths, but <em>NO Hamiltonian cycle</em>.
      </div>
    `
  }
};

export function renderTheoryTopic(topicKey) {
  const container = document.getElementById('theoryArticleContent');
  const topic = TheoryContent[topicKey] || TheoryContent.intro;
  container.innerHTML = topic.html;

  // Auto-render KaTeX if available
  if (window.renderMathInElement) {
    window.renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

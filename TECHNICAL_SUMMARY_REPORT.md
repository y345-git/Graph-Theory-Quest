# GRAPHQUEST: 2-PAGE TECHNICAL SUMMARY REPORT
**Course:** 7MA206 Discrete Mathematics · S.Y. B.Tech (IT) · ISE-2  
**Topic:** Interactive Gamified Graph Theory System & Reasoning Engine  
**Tech Stack:** Node.js, Express, Vite, Vanilla JavaScript, HTML5 SVG, KaTeX, Jest  

---

## 1. Mathematical Formulation & Theoretical Model (Criterion A1)

GraphQuest models discrete structures using formal Graph Theory $G = (V, E)$, where $V(G) = \{v_1, v_2, \dots, v_n\}$ represents the non-empty vertex set and $E(G) \subseteq V \times V$ represents the edge set.

### Standard Definitions & Theoretic Invariants
1. **Order and Size:** The order is denoted $n = |V|$ and size $m = |E|$. Maximum edges in a simple undirected graph is $\binom{n}{2} = \frac{n(n-1)}{2}$.
2. **Vertex Degree & Handshaking Lemma:** $\deg(v) = |\{e \in E \mid v \in e\}|$. Handshaking Lemma states:
   $$\sum_{v \in V} \deg(v) = 2|E|$$
   *Corollary:* Every graph has an even number of vertices with odd degree.
3. **Movement Hierarchy:**
   - *Walk:* Alternating sequence of vertices and edges (repetition allowed).
   - *Trail:* A walk with no repeated edges.
   - *Path:* A walk with no repeated vertices.
4. **Euler's Theorem (1736):** A connected graph contains an Euler Circuit $\iff$ all vertices have even degrees ($\text{oddCount} = 0$). It contains an Euler Path $\iff$ exactly 2 vertices have odd degrees ($\text{oddCount} = 2$).
5. **Hamiltonian Theorems & Complexity:** Determining Hamiltonian existence is NP-Complete ($O(2^n)$).
   - *Dirac's Theorem (1952):* If $n \ge 3$ and $\deg(v) \ge \frac{n}{2}$ for all $v \in V$, then $G$ is Hamiltonian.
   - *Ore's Theorem (1960):* If $n \ge 3$ and $\deg(u) + \deg(v) \ge n$ for all non-adjacent pairs $(u, v)$, then $G$ is Hamiltonian.
6. **Matrix Powers & Algebraic Theory:** $(A^k)_{ij}$ of Adjacency Matrix $A$ represents the exact count of walks of length $k$ between $v_i$ and $v_j$. Laplacian Matrix is $L = D - A$.

---

## 2. Algorithms & Step-by-Step Reasoning (Criterion A2, A3, A4)

| Algorithm | Theoretical Complexity | Implementation State Trace & Reasoning |
|---|:---:|---|
| **Breadth-First Search (BFS)** | $O(\|V\| + \|E\|)$ | FIFO queue snapshot, visited set, level distances $d(u)$, and tree edges $(u, v)$ logged at each step. |
| **Depth-First Search (DFS)** | $O(\|V\| + \|E\|)$ | LIFO recursion stack, discovery timestamp $d[u]$, finish timestamp $f[u]$, and cycle detection via back-edges. |
| **Hierholzer's Algorithm (Euler)** | $O(\|E\|)$ | Linear-time trail generation using stack-based sub-tour splicing; step-by-step edge removal logging. |
| **Backtracking Solver (Hamilton)** | $O(2^n \cdot n)$ | Recursive exploration tree; logs branching, candidate testing, and dead-end backtracks. |
| **Matrix Powers ($A^k$)** | $O(k \cdot n^3)$ | Computes $A^k$ matrix updates; outputs walk counts between all vertex pairs with formal interpretations. |

### Mathematical Edge Cases Handled (Criterion A4)
- **Null Graph ($\emptyset$):** $|V|=0, |E|=0$ handled gracefully with vacuous connectivity.
- **Trivial Graph ($K_1$):** $|V|=1, |E|=0, \deg(v)=0$; isolated vertex detected.
- **Disconnected Graphs ($k(G) \ge 2$):** Component partitioning via BFS/DFS; Eulerian rejection across disjoint components.
- **Self-Loops:** Properly contributes $+2$ to degree in Handshaking Lemma computation.
- **Petersen Graph:** Verified as 3-regular, non-Eulerian, containing Hamiltonian paths but no Hamiltonian cycle.

---

## 3. Software Architecture & Modularity (Criterion C1, C2, C3)

The system adheres to a strict multi-tiered client-server architecture:

```
[ FRONTEND CLIENT (Vite + Vanilla JS + SVG) ]
  ├── View Orchestrator (app.js) & Navigation Router
  ├── Interactive SVG Canvas Renderer (renderer.js)
  ├── 10-World Campaign Engine (game.js) & Sandbox Lab (lab.js)
  └── Local Storage Persistence (scoring.js) & REST Client (api.js)
                         │ (HTTP REST API / JSON)
                         ▼
[ BACKEND SERVICE (Node.js + Express) ]
  ├── Route Dispatchers: /api/graph, /api/game, /api/health
  └── Pure Algorithm Modules:
        ├── graph.js (Degree, Handshaking Lemma, Adjacency Matrix)
        ├── bfs.js & dfs.js (Traversals & Timestamps)
        ├── euler.js (Hierholzer & Walk Validator)
        ├── hamilton.js (Dirac, Ore & Backtracking Solver)
        └── matrix.js (Powers A^k & Laplacian L = D - A)
```

- **Input Validation & Error Handling:** Schema verification for all graph inputs; invalid node names, duplicate edges, and out-of-range power exponents return meaningful JSON error messages.
- **Automated Testing:** 18 automated unit and integration tests written in Jest (100% passing rate).

---

## 4. Gamification, UI & Usability (Criterion B1, B2, B3)

1. **GUI Quality:** Responsive cyber-mathematics dark interface with glowing SVG nodes and edge highlights, KaTeX mathematical typography, and synthesized audio feedback via Web Audio API.
2. **Dynamic Input:** Open **Graph Lab** allowing live node/edge creation, dragging, preset loading ($K_5, C_5, S_6$, Petersen, Königsberg), live adjacency matrix toggling, and random $G(n, p)$ graph generation.
3. **Game Mechanics:** 10 unlocked campaign worlds, XP scoring system, 3-star level ratings, and 3-tier progressive pedagogical hints with a -5 XP hint penalty.

---

## 5. Team Contribution & Viva Preparation (Criterion D)

- **Module 1 (Core Model & Traversals):** Graph data structures, Handshaking Lemma, BFS queue tracer, DFS stack tracer.
- **Module 2 (Eulerian & Hamiltonian Engines):** Hierholzer algorithm, backtracking solver, Dirac/Ore theorem checks.
- **Module 3 (Frontend & SVG Canvas):** Interactive SVG drag-and-drop renderer, matrix visualizer, audio synthesizer, and 10-World campaign UI.

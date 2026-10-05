# GraphQuest: Comprehensive Viva Preparation Guide
**Course:** 7MA206 Discrete Mathematics · S.Y. B.Tech (IT) · ISE-2 (10 Marks Evaluation)

---

## 🎯 Section 1: Core Mathematical Theory Viva Questions & Answers

### Q1: What is the Handshaking Lemma, and why is the number of odd-degree vertices always even?
**Answer:**  
The Handshaking Lemma states that in any undirected graph $G = (V, E)$, the sum of degrees of all vertices equals twice the number of edges:
$$\sum_{v \in V} \deg(v) = 2|E|$$
*Reasoning:* Each edge has two distinct endpoints; therefore, adding an edge contributes $+1$ to the degree of each incident vertex, increasing the degree sum by exactly $+2$.  
*Proof of Corollary:* Let $V_{even}$ and $V_{odd}$ partition $V$. Then:
$$\sum_{v \in V_{even}} \deg(v) + \sum_{u \in V_{odd}} \deg(u) = 2|E|$$
Since $2|E|$ is even and $\sum_{v \in V_{even}} \deg(v)$ is even, the sum of odd degrees $\sum_{u \in V_{odd}} \deg(u)$ must also be even. An odd number added an odd number of times is odd; therefore, $|V_{odd}|$ must be an even integer.

---

### Q2: What is the exact mathematical difference between a Walk, a Trail, and a Simple Path?
**Answer:**
1. **Walk:** An alternating sequence of vertices and edges $v_0, e_1, v_1, e_2, \dots, v_k$. Vertices and edges *may repeat*.
2. **Trail:** A walk where *no edge is repeated* (vertices may repeat, such as crossing an intersection multiple times).
3. **Simple Path:** A walk where *no vertex is repeated* (which automatically guarantees no edge is repeated).

---

### Q3: What are the necessary and sufficient conditions for an Euler Path and an Euler Circuit?
**Answer:**  
For a connected undirected graph (ignoring isolated vertices):
1. **Euler Circuit (Closed Euler Trail):** Exists if and only if **EVERY vertex has an EVEN degree** ($\text{oddCount} = 0$).
2. **Euler Path (Open Euler Trail):** Exists if and only if **EXACTLY TWO vertices have an ODD degree** ($\text{oddCount} = 2$). The trail *must* begin at one odd vertex and terminate at the other.
3. If $\text{oddCount} > 2$, no Eulerian trail exists.

---

### Q4: Why is finding an Euler Tour polynomial time ($O(|E|)$) while finding a Hamiltonian Cycle is NP-Complete?
**Answer:**  
- **Eulerian problems focus on EDGES:** We have a local necessary and sufficient condition (vertex parity $\deg(v) \pmod 2 = 0$) and can construct tours in $O(|E|)$ time using Hierholzer's algorithm.
- **Hamiltonian problems focus on VERTICES:** There is no known local necessary and sufficient characterization. Checking all possible permutations of vertices requires searching up to $O(n!)$ or $O(2^n \text{ poly}(n))$ states, making it NP-Complete.

---

### Q5: State Dirac's and Ore's Theorems for Hamiltonian Cycles.
**Answer:**
- **Dirac's Theorem (1952):** If a simple graph has $n \ge 3$ vertices and $\deg(v) \ge \frac{n}{2}$ for every $v \in V$, then $G$ contains a Hamiltonian Cycle.
- **Ore's Theorem (1960):** If a simple graph has $n \ge 3$ vertices and for every pair of non-adjacent vertices $u, v$, $\deg(u) + \deg(v) \ge n$, then $G$ contains a Hamiltonian Cycle.
*(Note: These are sufficient conditions, not necessary. A graph like $C_5$ is Hamiltonian even though $\deg(v) = 2 < 2.5$).*

---

### Q6: What is the significance of Adjacency Matrix Powers $A^k$?
**Answer:**  
The $(i, j)$-th entry of the matrix power $A^k$ represents the exact number of distinct **walks of length $k$** between vertex $v_i$ and vertex $v_j$.  
*Base Case:* $A^1_{ij} = 1$ if there is a walk of length 1 (an edge).  
*Inductive Step:* $(A^k)_{ij} = \sum_{m} (A^{k-1})_{im} \cdot A_{mj}$. This sums over all intermediate vertices $m$ that have a walk of length $k-1$ from $i$ and an edge $(m, j)$.

---

## 💻 Section 2: Code Architecture & Module Viva Questions

### Q7: Explain the architecture of GraphQuest and how the frontend communicates with the backend.
**Answer:**  
GraphQuest implements a modular client-server REST architecture:
- **Backend:** Built with Node.js and Express. Algorithm logic is isolated into pure mathematical modules (`server/algorithms/graph.js`, `bfs.js`, `dfs.js`, `euler.js`, `hamilton.js`, `matrix.js`).
- **Frontend:** Built with Vite and Vanilla JavaScript. SVG DOM is dynamically manipulated by `renderer.js` for draggable vertices and highlighted paths.
- **Communication:** Client sends graph JSON payloads (`{ vertices: [...], edges: [...] }`) via `fetch()` to `/api/graph/analyze`, `/api/graph/bfs`, etc., receiving JSON execution traces.

---

### Q8: How does the step-by-step algorithm visualizer work in GraphQuest?
**Answer:**  
In `server/algorithms/bfs.js` (and DFS/Euler/Hamilton), the algorithm does not just compute the final result; it records an array of execution step objects (`steps: [...]`). Each step object captures:
- `stepIndex` & `action` (e.g., `'ENQUEUE'`, `'DEQUEUE'`, `'CHECK_NEIGHBOR'`)
- Snapshot of data structure state (`queue`, `stack`, `visited`, `distances`)
- `activeEdge` and `currentVertex`
- Mathematical descriptive reasoning.  
The frontend `LabController` receives this trace and steps through it with timer intervals, highlighting active SVG elements in sync with the queue/stack display.

---

### Q9: How did you test the application and handle mathematical edge cases?
**Answer:**  
We wrote 18 automated Jest tests in the `tests/` directory:
1. `graph.test.js`: Verified Handshaking Lemma, adjacency matrix, and edge cases ($\emptyset$ empty graph, 1-vertex graph, disconnected components).
2. `bfs_dfs.test.js`: Verified traversal distances, timestamps, and back-edge cycle detection.
3. `euler.test.js`: Tested 0 odd, 2 odd, and $>2$ odd vertex graphs, plus walk validation.
4. `hamilton.test.js`: Verified Dirac's theorem on $K_4$, Hamiltonian backtracking, and verified that the **Petersen Graph** is non-Hamiltonian.
5. `api.test.js`: Supertest integration tests for all REST endpoints.

---

## 👥 Section 3: Individual Contribution Allocation

| Team Member | Primary Module & Responsibilities | Key Code Files |
|---|---|---|
| **Member 1** | **Graph Core & Algebraic Theory:** Formulated $G=(V,E)$, Handshaking Lemma, Degree Sequence, Adjacency Matrix $A(G)$, and Matrix Powers $A^k$. | `server/algorithms/graph.js`, `server/algorithms/matrix.js`, `tests/graph.test.js` |
| **Member 2** | **Traversals & Eulerian Engine:** Implemented BFS queue tracer, DFS stack tracer with timestamps, Hierholzer's algorithm, and walk validators. | `server/algorithms/bfs.js`, `server/algorithms/dfs.js`, `server/algorithms/euler.js`, `tests/euler.test.js` |
| **Member 3** | **Hamiltonian Solver & Game UI:** Implemented Hamiltonian backtracking search, Dirac/Ore theorem checks, interactive SVG graph canvas, and 10-World campaign engine. | `server/algorithms/hamilton.js`, `client/js/renderer.js`, `client/js/game.js`, `client/js/lab.js` |

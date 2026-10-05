# GraphQuest
## A Gamified Graph Theory Learning Game

**Technology:** Vite + Vanilla JavaScript + Node.js + Express

GraphQuest is a beginner-friendly web game that teaches Graph Theory progressively.

The player starts with **zero knowledge of graphs** and gradually learns:

```text
Graph Basics
     ↓
Vertices & Edges
     ↓
Degree
     ↓
Graph Representation
     ↓
Walks & Paths
     ↓
Cycles
     ↓
Connectivity
     ↓
BFS & DFS
     ↓
Euler Path & Circuit
     ↓
Hamiltonian Path & Cycle
```

The main goal is to make learning Graph Theory feel like progressing through a game rather than reading a textbook.

---

# 1. Technology Stack

Keep the technology simple so that every part of the project can be explained during the viva.

## Frontend

### Vite

Used as the frontend development and build tool.

```text
Vite
```

Benefits:

- Fast development server
- Simple project structure
- Easy deployment
- No unnecessary framework complexity

---

### HTML

Used for the application structure.

Examples:

```text
Home
Learn
Game
Level Selection
Graph Lab
Progress
```

---

### CSS

Used for:

- Layout
- Game UI
- Buttons
- Cards
- Level screens
- Animations
- Responsive design

No CSS framework is required.

---

### Vanilla JavaScript

Used for:

- Game logic
- User interaction
- Graph manipulation
- Level progression
- Score
- XP
- Hints
- Graph rendering
- Communication with Node.js

---

### SVG

Use SVG to draw graphs.

A graph can be represented as:

```text
Vertex → <circle>
Edge   → <line>
Label  → <text>
```

SVG makes it easy to:

- Click vertices
- Select edges
- Highlight paths
- Move vertices
- Animate traversals

---

# 2. Backend

## Node.js

Node.js handles the server-side logic.

Responsibilities:

- Graph algorithms
- Graph validation
- Level generation
- Challenge generation
- Score validation
- API endpoints

---

## Express.js

Express provides the backend API.

Example:

```text
/api/levels
/api/graph
/api/analyze
/api/euler
/api/hamilton
```

---

# 3. No Database Initially

Do not add a database unless it becomes necessary.

For the ISE project, use:

```text
JSON files
```

for:

- Level data
- Questions
- Graph configurations
- Learning content

Use:

```text
localStorage
```

for:

- Player progress
- XP
- Completed levels
- Stars
- Settings

This keeps the project simple and easy to explain.

---

# 4. Basic Project Structure

```text
graphquest/
│
├── client/
│   ├── index.html
│   ├── style.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── game.js
│   │   ├── graph.js
│   │   ├── renderer.js
│   │   ├── levels.js
│   │   ├── scoring.js
│   │   └── api.js
│   │
│   └── assets/
│
├── server/
│   ├── server.js
│   │
│   ├── algorithms/
│   │   ├── graph.js
│   │   ├── bfs.js
│   │   ├── dfs.js
│   │   ├── euler.js
│   │   └── hamilton.js
│   │
│   ├── routes/
│   │   ├── graph.js
│   │   └── game.js
│   │
│   └── data/
│       └── levels.json
│
├── tests/
│
├── package.json
└── README.md
```

---

# 5. Game Structure

The game should be divided into **Worlds**.

Each world introduces only a small amount of new theory.

```text
WORLD 1
What is a Graph?

WORLD 2
Vertices and Edges

WORLD 3
Understanding Degree

WORLD 4
Representing Graphs

WORLD 5
Walks, Trails and Paths

WORLD 6
Cycles and Connectivity

WORLD 7
BFS and DFS

WORLD 8
Euler Paths and Circuits

WORLD 9
Hamiltonian Paths and Cycles

WORLD 10
Graph Theory Master
```

---

# WORLD 1 — What is a Graph?

## Goal

The player has absolutely no knowledge of Graph Theory.

Do not use complicated terminology initially.

Start with a real-world example.

### Example

Show:

```text
🏠 House A
     |
     |
🏠 House B
```

Explain:

> We can represent objects as points and relationships between them as lines.

Then introduce:

```text
Point = Vertex
Line = Edge
```

---

## Level 1.1 — Identify Objects

Show:

```text
A ●────● B
```

Question:

> Which part represents an object?

Answer:

```text
●
```

---

## Level 1.2 — Identify Connections

Question:

> Which part represents a connection?

Answer:

```text
────
```

---

## Level 1.3 — Count Objects

```text
A ●────● B────● C
```

Question:

> How many vertices?

Answer:

```text
3
```

---

## Level 1.4 — Count Connections

Same graph.

Question:

> How many edges?

Answer:

```text
2
```

---

# WORLD 2 — Vertices and Edges

Now introduce proper terminology.

Teach:

### Vertex

A point/object in the graph.

### Edge

A connection between two vertices.

Example:

```text
A ●────────● B
```

Explain:

```text
Vertices = A, B

Edge = A-B
```

---

## Gameplay

The player receives a graph and must:

- Select all vertices
- Select all edges
- Count vertices
- Count edges

---

# WORLD 3 — Degree

Now introduce:

> The degree of a vertex is the number of edges connected to it.

Example:

```text
      B
      |
A ─── C ─── D
      |
      E
```

The player clicks C.

Show:

```text
C has 4 connected edges.

Degree(C) = 4
```

---

## Challenges

### Level 3.1

Find degree of A.

### Level 3.2

Find degree of C.

### Level 3.3

Find all vertices with degree 1.

### Level 3.4

Find all vertices with even degree.

### Level 3.5

Find all vertices with odd degree.

This prepares the player for Euler theory later.

---

# WORLD 4 — Graph Representation

Now introduce how graphs are represented mathematically.

## Level 4.1 — Visual Graph

```text
A────B
│    │
C────D
```

---

## Level 4.2 — Edge List

Teach:

```text
(A,B)
(A,C)
(B,D)
(C,D)
```

---

## Level 4.3 — Adjacency List

Teach:

```text
A → B,C
B → A,D
C → A,D
D → B,C
```

---

## Level 4.4 — Adjacency Matrix

Teach:

```text
    A B C D

A   0 1 1 0
B   1 0 0 1
C   1 0 0 1
D   0 1 1 0
```

The player doesn't need to memorize the matrix immediately.

Make it interactive.

For example:

> A and B are connected. What should be placed at A,B?

Answer:

```text
1
```

---

# WORLD 5 — Walks, Trails and Paths

Now the player understands vertices and edges.

Introduce movement through a graph.

## Walk

A sequence where vertices/edges can be repeated.

Example:

```text
A → B → C → B → D
```

---

## Trail

A route where an edge is not repeated.

---

## Path

A route where a vertex is not repeated.

---

## Game

Give:

```text
A────B────C
│    │    │
D────E────F
```

Ask:

> Create a path from A to F.

Player clicks:

```text
A → D → E → F
```

---

# WORLD 6 — Cycles and Connectivity

## Cycle

Teach:

> A path that returns to its starting point.

Example:

```text
A → B → C → D → A
```

---

## Connectivity

Explain using a simple real-world example:

> Can you travel from every location to every other location?

Connected:

```text
A──B──C──D
```

Disconnected:

```text
A──B       C──D
```

---

## Challenges

Player determines:

- Connected / disconnected
- Number of components
- Find a cycle
- Find a path
- Find a vertex that disconnects part of the graph

Keep the last challenge optional if it goes beyond the required syllabus.

---

# WORLD 7 — BFS and DFS

Only introduce these after the player understands paths.

---

## BFS

Explain:

> Explore nearby vertices first.

Example:

```text
        A
       / \
      B   C
     / \   \
    D   E   F
```

Starting from A:

```text
A → B → C → D → E → F
```

Make the player click vertices in the correct order.

---

## DFS

Explain:

> Go as deep as possible before coming back.

Possible traversal:

```text
A → B → D → E → C → F
```

The game should animate both algorithms.

---

# WORLD 8 — Euler Paths and Circuits

Now introduce the first advanced topic.

Start with the concept before the terminology.

Explain:

> Imagine drawing a figure without lifting your pen and without drawing the same line twice.

Then introduce:

> This is related to an Euler Path.

---

## Euler Path

> Visit every edge exactly once.

Example:

```text
A────B
│    │
D────C
```

Possible path:

```text
A → B → C → D
```

---

## Euler Circuit

> Visit every edge exactly once and return to the starting vertex.

Example:

```text
A → B → C → D → A
```

---

## Euler Theory Challenge

Now introduce degree conditions.

For a connected undirected graph:

```text
0 odd vertices
→ Euler Circuit

2 odd vertices
→ Euler Path

More than 2 odd vertices
→ No Euler Path
```

The game should make the player discover this through challenges.

---

# WORLD 9 — Hamiltonian Paths and Cycles

This is the final major concept.

Start with a real-world explanation:

> Imagine visiting every city exactly once.

Then:

> This is a Hamiltonian Path problem.

---

## Hamiltonian Path

Visit every vertex exactly once.

Example:

```text
A → B → C → D → E
```

---

## Hamiltonian Cycle

Visit every vertex exactly once and return to the starting vertex.

```text
A → B → C → D → E → A
```

---

## Important Comparison

The game should explicitly teach:

```text
Euler
─────
Focus: EDGES

Visit every edge exactly once.


Hamilton
────────
Focus: VERTICES

Visit every vertex exactly once.
```

This distinction should appear repeatedly.

---

# WORLD 10 — Graph Theory Master

The final world combines everything.

Give the player a random graph.

Ask:

```text
1. How many vertices?
2. How many edges?
3. What is the degree of each vertex?
4. Is the graph connected?
5. Perform BFS.
6. Perform DFS.
7. Does an Euler Path exist?
8. Does an Euler Circuit exist?
9. Does a Hamiltonian Path exist?
10. Does a Hamiltonian Cycle exist?
```

The player earns a large XP reward for completing the entire analysis.

---

# 6. Game Progression

The player should unlock worlds sequentially.

```text
🔒 World 1
      ↓
🔒 World 2
      ↓
🔒 World 3
      ↓
🔒 World 4
      ↓
🔒 World 5
      ↓
🔒 World 6
      ↓
🔒 World 7
      ↓
🔒 World 8
      ↓
🔒 World 9
      ↓
🏆 World 10
```

A player cannot reach Hamiltonian challenges without first learning the fundamentals.

---

# 7. Level Structure

Each concept should have approximately:

```text
1. Learn
2. Example
3. Easy Challenge
4. Practice Challenge
5. Hard Challenge
6. Concept Test
```

For example:

```text
WORLD 3: DEGREE

Level 3.1
What is Degree?

Level 3.2
Count Degree

Level 3.3
Find Odd Degree

Level 3.4
Find Even Degree

Level 3.5
Degree Challenge

Level 3.6
World Test
```

---

# 8. Game Mechanics

Keep the gamification simple.

## Score

```text
Correct answer       +10
Hard challenge       +30
World completion     +100
Hint                 -5
Wrong answer         -2
```

---

## Stars

Each level:

```text
⭐
⭐⭐
⭐⭐⭐
```

Three stars means:

- Correct
- No/limited hints
- Few mistakes

---

## XP

XP unlocks new worlds.

```text
Level 1 → 100 XP
Level 2 → 200 XP
Level 3 → 350 XP
...
```

Don't make XP overly complicated.

---

# 9. Hints

Hints should teach instead of simply giving the answer.

Example:

### Euler challenge

First hint:

> Count the degree of each vertex.

Second hint:

> How many vertices have odd degree?

Third hint:

> A connected graph with exactly two odd-degree vertices has an Euler Path.

---

# 10. Graph Rendering

The game should use SVG.

The player should be able to:

- Click vertices
- Click edges
- Drag vertices
- Select a starting vertex
- Build paths
- Reset paths

Example:

```text
      A ●
     /   \
    /     \
 B ●───────● C
```

When the player clicks:

```text
A → B
```

the edge becomes highlighted.

---

# 11. Graph Engine

Create a simple graph class.

```javascript
class Graph {
    constructor() {
        this.vertices = [];
        this.edges = [];
    }

    addVertex(vertex) {}

    addEdge(source, target) {}

    removeVertex(vertex) {}

    removeEdge(source, target) {}

    getNeighbors(vertex) {}

    getDegree(vertex) {}

    getAdjacencyMatrix() {}

    isConnected() {}
}
```

This becomes the foundation of the entire project.

---

# 12. Algorithms

Implement only the algorithms actually needed.

```text
Graph Basics
│
├── Degree
├── Adjacency Matrix
├── Connectivity
│
├── BFS
├── DFS
│
├── Euler Path
├── Euler Circuit
│
├── Hamiltonian Path
└── Hamiltonian Cycle
```

---

# 13. Node.js Backend

The backend doesn't need to be huge.

```text
Node.js
   │
   └── Express
         │
         ├── /api/levels
         ├── /api/graph/analyze
         ├── /api/euler
         └── /api/hamilton
```

The frontend sends a graph:

```json
{
  "vertices": ["A", "B", "C", "D"],
  "edges": [
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["D", "A"]
  ]
}
```

Node.js analyzes it and returns the result.

---

# 14. Dynamic Graphs

Do not hardcode only one graph.

Create different graph configurations.

For example:

```text
levels.json
```

```json
{
  "id": 8,
  "world": 3,
  "concept": "degree",
  "difficulty": 2,
  "graph": {
    "vertices": ["A", "B", "C", "D"],
    "edges": [
      ["A", "B"],
      ["A", "C"],
      ["B", "C"],
      ["C", "D"]
    ]
  }
}
```

Later, add random graph generation for harder levels.

---

# 15. Graph Lab

Keep Graph Lab simple.

The player can:

```text
Add Vertex
Add Edge
Delete Edge
Move Vertex
```

Then:

```text
Analyze Graph
```

Output:

```text
Vertices: 6
Edges: 7

Degrees:
A → 2
B → 3
C → 2
D → 1
E → 3
F → 1

Connected: Yes

Euler Path: Yes
Euler Circuit: No
```

This feature is particularly useful during the ISE demonstration.

---

# 16. Mathematical Explanation

Whenever the game evaluates an answer, don't just say:

```text
❌ Wrong
```

Instead:

```text
❌ Not an Euler Path

Reason:

You used edge B-C twice.

Euler Paths require:

Every edge → exactly once.
```

For correct answers:

```text
✅ Correct!

You visited all 6 edges exactly once.

Therefore:

This is a valid Euler Path.
```

This directly supports the **mathematical reasoning marks**.

---

# 17. Edge Cases

The system should handle:

```text
Empty graph
Single vertex
Disconnected graph
Isolated vertex
Invalid vertex
Duplicate edge
Invalid path
Repeated edge
Repeated vertex
```

Example:

```text
❌ Hamiltonian Path

Vertex C was visited twice.

Hamiltonian Path:
Every vertex must be visited exactly once.
```

---

# 18. Development Roadmap

## Phase 1 — Project Setup

Create:

```text
Vite frontend
Node.js backend
Express server
Git repository
```

Get the frontend talking to the backend.

---

## Phase 2 — Graph Engine

Implement:

```text
Vertex
Edge
Graph

addVertex()
addEdge()
removeVertex()
removeEdge()
getDegree()
getNeighbors()
```

---

## Phase 3 — Graph Renderer

Create SVG graph rendering.

Implement:

```text
Draw vertex
Draw edge
Click vertex
Click edge
Move vertex
Highlight path
Reset graph
```

---

## Phase 4 — Basic Graph Learning

Build Worlds 1–4:

```text
Graph
Vertices
Edges
Degree
Representation
```

Don't implement advanced algorithms yet.

---

## Phase 5 — Paths & Connectivity

Build Worlds 5–6:

```text
Walk
Trail
Path
Cycle
Connectivity
Components
```

---

## Phase 6 — BFS & DFS

Implement:

```text
BFS
DFS
```

Add animated traversal.

---

## Phase 7 — Euler

Implement:

```text
Euler Path
Euler Circuit
```

Add degree-based reasoning.

---

## Phase 8 — Hamilton

Implement:

```text
Hamiltonian Path
Hamiltonian Cycle
```

Use backtracking.

---

## Phase 9 — Game System

Add:

```text
Levels
Worlds
Score
XP
Stars
Hints
Progress
```

---

## Phase 10 — Graph Lab

Add:

```text
Custom graph creation
Graph analysis
Random graph
```

---

## Phase 11 — Testing

Test:

```text
Graph operations
Degree
Connectivity
BFS
DFS
Euler
Hamilton
Invalid inputs
Edge cases
```

---

## Phase 12 — Final UI

Improve:

```text
Home page
World map
Level selection
Game screen
Learning screen
Graph Lab
Progress screen
```

Add animations only after the functionality is stable.

---

# 19. Recommended Final Application

The home screen:

```text
╔══════════════════════════════════════╗
║              GRAPHQUEST              ║
║                                      ║
║      Learn Graph Theory by Playing   ║
║                                      ║
║            [ START GAME ]             ║
║                                      ║
║              [ LEARN ]                ║
║                                      ║
║            [ GRAPH LAB ]             ║
║                                      ║
║            [ PROGRESS ]              ║
╚══════════════════════════════════════╝
```

World map:

```text
       🟢
   Graph Basics
       │
       ▼
       🟢
 Vertices & Edges
       │
       ▼
       🟢
     Degree
       │
       ▼
       🟢
Representation
       │
       ▼
       🟢
 Paths & Cycles
       │
       ▼
       🟢
 Connectivity
       │
       ▼
       🟢
    BFS / DFS
       │
       ▼
       🟡
 Euler
       │
       ▼
       🔴
 Hamilton
       │
       ▼
       👑
    MASTER
```

---

# 20. Final Tech Stack

Keep the official project stack very short:

| Technology | Purpose |
|---|---|
| **Vite** | Frontend development/build |
| **HTML5** | UI structure |
| **CSS3** | Styling and animations |
| **JavaScript** | Frontend/game logic |
| **SVG** | Interactive graph visualization |
| **Node.js** | Backend runtime |
| **Express.js** | Backend API |
| **JSON** | Level/game data |
| **localStorage** | Player progress |
| **Jest** | Algorithm testing |
| **Git + GitHub** | Version control |

No React.

No Next.js.

No database initially.

No unnecessary libraries.

---

# 21. Final Learning Progression

The most important part of the project is this progression:

```text
                 GRAPHQUEST
                     │
                     ▼
          "What is a Graph?"
                     │
                     ▼
              Vertices & Edges
                     │
                     ▼
                  Degree
                     │
                     ▼
           Graph Representation
                     │
                     ▼
          Walk → Trail → Path
                     │
                     ▼
                 Cycles
                     │
                     ▼
              Connectivity
                     │
                     ▼
                BFS / DFS
                     │
                     ▼
              Euler Path
                     │
                     ▼
            Euler Circuit
                     │
                     ▼
           Hamiltonian Path
                     │
                     ▼
          Hamiltonian Cycle
                     │
                     ▼
             🏆 MASTER
```

The key design principle is:

> **Never introduce a concept before the player has learned the concepts required to understand it.**

So a player who knows **nothing about graphs** can start at World 1, learn what a vertex and edge are through a simple game, and eventually reach Hamiltonian problems without needing external Graph Theory knowledge.
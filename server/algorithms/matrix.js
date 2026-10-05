/**
 * GraphQuest - Matrix Operations & Algebraic Graph Theory
 * Discrete Mathematics (7MA206) - Module 5: Matrix Representations of Graphs
 */

const Graph = require('./graph');

/**
 * Multiply two square matrices A and B
 * @param {number[][]} A 
 * @param {number[][]} B 
 * @returns {number[][]}
 */
function multiplyMatrices(A, B) {
  const n = A.length;
  const C = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      if (A[i][k] !== 0) {
        for (let j = 0; j < n; j++) {
          C[i][j] += A[i][k] * B[k][j];
        }
      }
    }
  }
  return C;
}

/**
 * Compute matrix power A^k with step-by-step reasoning
 * Theorem: (A^k)_ij equals the number of distinct walks of length k between v_i and v_j.
 * 
 * @param {Graph} graph 
 * @param {number} k Power exponent (1 to 5)
 * @returns {{
 *   vertexOrder: string[],
 *   originalMatrix: number[][],
 *   powerMatrix: number[][],
 *   exponent: number,
 *   walkCounts: Array<{ u: string, v: string, count: number }>,
 *   interpretation: string
 * }}
 */
function computeMatrixPower(graph, k = 2) {
  const { matrix, vertexOrder } = graph.getAdjacencyMatrix();
  const n = vertexOrder.length;

  if (n === 0) {
    return {
      vertexOrder: [],
      originalMatrix: [],
      powerMatrix: [],
      exponent: k,
      walkCounts: [],
      interpretation: 'Empty graph.'
    };
  }

  // Identity matrix for k=0
  let result = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let p = 0; p < k; p++) {
    result = multiplyMatrices(result, matrix);
  }

  const walkCounts = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      walkCounts.push({
        u: vertexOrder[i],
        v: vertexOrder[j],
        count: result[i][j]
      });
    }
  }

  const interpretation = `Theorem: The (i, j)-th entry of the adjacency matrix raised to power k (A^${k}) ` +
    `represents the total number of distinct walks of exact length ${k} from vertex v_i to vertex v_j.`;

  return {
    vertexOrder,
    originalMatrix: matrix,
    powerMatrix: result,
    exponent: k,
    walkCounts,
    interpretation
  };
}

/**
 * Compute Degree Matrix D and Laplacian Matrix L = D - A
 * @param {Graph} graph 
 * @returns {{
 *   vertexOrder: string[],
 *   adjacencyMatrix: number[][],
 *   degreeMatrix: number[][],
 *   laplacianMatrix: number[][],
 *   explanation: string
 * }}
 */
function computeLaplacian(graph) {
  const { matrix: A, vertexOrder } = graph.getAdjacencyMatrix();
  const n = vertexOrder.length;

  const D = Array.from({ length: n }, () => Array(n).fill(0));
  const L = Array.from({ length: n }, () => Array(n).fill(0));

  vertexOrder.forEach((v, i) => {
    const deg = graph.getDegree(v);
    D[i][i] = deg;
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      L[i][j] = D[i][j] - A[i][j];
    }
  }

  return {
    vertexOrder,
    adjacencyMatrix: A,
    degreeMatrix: D,
    laplacianMatrix: L,
    explanation: 'Laplacian Matrix L = D - A. In algebraic graph theory, Kirchhoff\'s Matrix Tree Theorem uses L to compute the number of spanning trees in G.'
  };
}

module.exports = {
  multiplyMatrices,
  computeMatrixPower,
  computeLaplacian
};

/**
 * GraphQuest - Graph Lab Sandbox & Algorithm Step-by-Step Visualizer
 * Discrete Mathematics (7MA206) - Evaluator Mode
 */

import { Graph } from './graph.js';
import { GraphRenderer } from './renderer.js';
import { ApiService } from './api.js';

export class LabController {
  constructor(soundService) {
    this.sound = soundService;
    this.graph = new Graph();
    this.renderer = null;

    // Lab interaction state
    this.interactionMode = 'DEFAULT'; // 'DEFAULT' | 'ADD_EDGE'
    this.edgeFirstVertex = null;

    // Algorithm animation state
    this.animationSteps = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.animTimer = null;
    this.speedMs = 800;

    this.initDOM();
  }

  initDOM() {
    const svg = document.getElementById('labSvgCanvas');
    const edgesG = document.getElementById('labEdgesGroup');
    const verticesG = document.getElementById('labVerticesGroup');

    this.renderer = new GraphRenderer(svg, edgesG, verticesG);
    this.renderer.onVertexClick = (v) => this.handleVertexClick(v);
    this.renderer.onEdgeClick = (u, v) => this.handleEdgeClick(u, v);

    // Lab Toolbar Buttons
    document.getElementById('labAddVertexBtn').addEventListener('click', () => this.addVertexPrompt());
    document.getElementById('labAddEdgeBtn').addEventListener('click', () => this.startAddEdgeMode());
    document.getElementById('labDeleteBtn').addEventListener('click', () => this.deleteSelected());
    document.getElementById('labClearAllBtn').addEventListener('click', () => this.clearGraph());
    document.getElementById('labArrangeCircleBtn').addEventListener('click', () => {
      this.renderer.arrangeInCircle();
      this.renderMatrixGrid();
    });
    document.getElementById('labLoadPresetBtn').addEventListener('click', () => this.loadSelectedPreset());

    // Tabs
    document.querySelectorAll('.lab-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lab-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.lab-tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const tabKey = btn.dataset.tab;
        document.getElementById(`lab-tab-${tabKey}`).classList.add('active');

        if (tabKey === 'matrix') this.renderMatrixGrid();
        if (tabKey === 'animator') this.populateStartVertexOptions();
      });
    });

    // Audit & Matrix Buttons
    document.getElementById('labRunAuditBtn').addEventListener('click', () => this.runFullAudit());
    document.getElementById('labCalcMatrixPowerBtn').addEventListener('click', () => this.calculateMatrixPower());

    // Animator Controls
    document.getElementById('animPlayBtn').addEventListener('click', () => this.playAnimation());
    document.getElementById('animPauseBtn').addEventListener('click', () => this.pauseAnimation());
    document.getElementById('animNextBtn').addEventListener('click', () => this.stepNext());
    document.getElementById('animPrevBtn').addEventListener('click', () => this.stepPrev());
    document.getElementById('animResetBtn').addEventListener('click', () => this.resetAnimation());

    document.getElementById('animAlgorithmSelect').addEventListener('change', () => {
      this.resetAnimation();
      this.loadAlgorithmSteps();
    });

    document.getElementById('animStartVertexSelect').addEventListener('change', () => {
      this.resetAnimation();
      this.loadAlgorithmSteps();
    });

    const speedSlider = document.getElementById('animSpeedSlider');
    speedSlider.addEventListener('input', (e) => {
      this.speedMs = parseInt(e.target.value, 10);
      document.getElementById('animSpeedValue').textContent = `${(this.speedMs / 1000).toFixed(1)}s`;
      if (this.isPlaying) {
        this.pauseAnimation();
        this.playAnimation();
      }
    });

    // Load initial default graph: Cycle C_5
    this.loadPresetTopology('cycle', 5);
  }

  async loadSelectedPreset() {
    const preset = document.getElementById('labPresetSelect').value;
    await this.loadPresetTopology(preset);
  }

  async loadPresetTopology(preset, n = 5) {
    try {
      const res = await ApiService.loadPreset(preset, n);
      if (res.success) {
        this.graph = Graph.fromJSON(res.graph);
        this.renderer.setGraph(this.graph);
        this.renderer.arrangeInCircle();
        this.renderMatrixGrid();
        this.populateStartVertexOptions();
        this.runFullAudit();
      }
    } catch (e) {
      console.error('Failed to load preset', e);
    }
  }

  addVertexPrompt() {
    const existing = this.graph.getVertices();
    const nextChar = String.fromCharCode(65 + (existing.length % 26)) + (existing.length >= 26 ? Math.floor(existing.length / 26) : '');
    const name = prompt('Enter Vertex Name:', nextChar);
    if (name && name.trim()) {
      const added = this.graph.addVertex(name.trim());
      if (added) {
        this.renderer.arrangeInCircle();
        this.renderMatrixGrid();
        this.populateStartVertexOptions();
        this.sound.playClick();
      } else {
        alert(`Vertex "${name}" already exists in graph.`);
      }
    }
  }

  startAddEdgeMode() {
    this.interactionMode = 'ADD_EDGE';
    this.edgeFirstVertex = null;
    this.renderer.clearSelection();
    document.getElementById('labCanvasStatus').textContent = 'Mode: Click source vertex for new edge...';
    document.getElementById('labCanvasStatus').style.color = 'var(--accent-amber)';
  }

  handleVertexClick(vertex) {
    this.sound.playClick();

    if (this.interactionMode === 'ADD_EDGE') {
      if (!this.edgeFirstVertex) {
        this.edgeFirstVertex = vertex;
        this.renderer.toggleSelectVertex(vertex);
        document.getElementById('labCanvasStatus').textContent = `Selected "${vertex}". Click target vertex...`;
      } else {
        if (this.edgeFirstVertex !== vertex) {
          this.graph.addEdge(this.edgeFirstVertex, vertex);
          this.renderer.render();
          this.renderMatrixGrid();
          this.sound.playWin();
        }
        this.interactionMode = 'DEFAULT';
        this.edgeFirstVertex = null;
        this.renderer.clearSelection();
        document.getElementById('labCanvasStatus').textContent = 'Mode: Drag & Select';
        document.getElementById('labCanvasStatus').style.color = 'var(--accent-cyan)';
      }
    } else {
      this.renderer.toggleSelectVertex(vertex);
    }
  }

  handleEdgeClick(u, v) {
    this.sound.playClick();
    this.renderer.toggleSelectEdge(u, v);
  }

  deleteSelected() {
    const vList = Array.from(this.renderer.selectedVertices);
    const eList = Array.from(this.renderer.selectedEdges);

    vList.forEach(v => this.graph.removeVertex(v));
    eList.forEach(eKey => {
      const [u, v] = eKey.split('-');
      this.graph.removeEdge(u, v);
    });

    this.renderer.clearSelection();
    this.renderer.render();
    this.renderMatrixGrid();
    this.populateStartVertexOptions();
    this.sound.playClick();
  }

  clearGraph() {
    if (confirm('Are you sure you want to clear the entire graph canvas?')) {
      this.graph.clear();
      this.renderer.clearSelection();
      this.renderer.render();
      this.renderMatrixGrid();
      this.populateStartVertexOptions();
    }
  }

  // --- Adjacency Matrix Live Grid ---

  renderMatrixGrid() {
    const container = document.getElementById('labMatrixGridContainer');
    const vertices = this.graph.getVertices();

    if (vertices.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); padding:10px;">Graph is empty.</p>';
      return;
    }

    let html = '<table class="matrix-grid-table"><thead><tr><th></th>';
    vertices.forEach(v => {
      html += `<th>${v}</th>`;
    });
    html += '</tr></thead><tbody>';

    vertices.forEach(u => {
      html += `<tr><th>${u}</th>`;
      vertices.forEach(v => {
        const has = this.graph.hasEdge(u, v);
        html += `
          <td>
            <button class="matrix-cell-input ${has ? 'connected' : ''}" data-u="${u}" data-v="${v}" style="cursor:pointer; width:100%; border-radius:4px; ${has ? 'background:rgba(6,214,160,0.3); color:#fff; font-weight:800;' : 'color:var(--text-muted);'}">
              ${has ? '1' : '0'}
            </button>
          </td>
        `;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    // Add click listeners to toggle edges
    container.querySelectorAll('.matrix-cell-input').forEach(cell => {
      cell.addEventListener('click', () => {
        const u = cell.dataset.u;
        const v = cell.dataset.v;
        if (u === v) return; // Ignore self loops for simple graph

        if (this.graph.hasEdge(u, v)) {
          this.graph.removeEdge(u, v);
        } else {
          this.graph.addEdge(u, v);
        }
        this.renderer.render();
        this.renderMatrixGrid();
        this.sound.playClick();
      });
    });
  }

  async calculateMatrixPower() {
    try {
      const res = await ApiService.computeMatrixPower(this.graph.toJSON(), 2);
      if (res.success) {
        const expl = document.getElementById('matrixPowerExplanation');
        expl.innerHTML = `
          <strong>Matrix Power A² (Number of Walks of Length 2):</strong><br>
          ${res.interpretation}<br>
          <div style="font-family:var(--font-mono); margin-top:6px; font-size:0.8rem; max-height:100px; overflow-y:auto;">
            ${res.walkCounts.filter(w => w.count > 0).map(w => `Walks(${w.u} → ${w.v}): ${w.count}`).join(' | ')}
          </div>
        `;
      }
    } catch (e) {
      console.error('Failed to compute matrix power', e);
    }
  }

  // --- Full Mathematical Audit ---

  async runFullAudit() {
    try {
      const res = await ApiService.analyzeGraph(this.graph.toJSON());
      if (!res.success) return;

      const a = res.analysis;
      document.getElementById('auditOrder').textContent = a.order;
      document.getElementById('auditSize').textContent = a.size;
      document.getElementById('auditConnected').textContent = a.isConnected ? 'YES' : 'NO';
      document.getElementById('auditComponents').textContent = a.componentCount;
      document.getElementById('auditHandshaking').textContent = a.handshaking.holds ? `Valid (Sum=${a.handshaking.sumOfDegrees} = 2*${a.handshaking.edgeCount})` : 'Fail';
      document.getElementById('auditEuler').textContent = a.euler.eulerType;
      document.getElementById('auditHamilton').textContent = a.hamiltonian.hasCycle ? 'Cycle Exists' : a.hamiltonian.hasPath ? 'Path Exists' : 'None';
      document.getElementById('auditDirac').textContent = a.hamiltonian.theorems.diracSatisfied ? 'Satisfied' : 'Inconclusive';

      const exp = document.getElementById('auditExplanationBox');
      exp.innerHTML = `
        <strong>Mathematical Reasoning:</strong><br>
        • <strong>Handshaking Lemma:</strong> ${a.handshaking.explanation}<br>
        • <strong>Euler Analysis:</strong> ${a.euler.reasoning}<br>
        • <strong>Hamiltonian Theorems:</strong> ${a.hamiltonian.theorems.diracExplanation}
      `;
    } catch (e) {
      console.error('Audit failed', e);
    }
  }

  // --- Algorithm Traversal Stepper ---

  populateStartVertexOptions() {
    const select = document.getElementById('animStartVertexSelect');
    const prev = select.value;
    select.innerHTML = '';
    const vertices = this.graph.getVertices();

    if (vertices.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '(No vertices)';
      select.appendChild(opt);
      return;
    }

    vertices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = `Vertex ${v}`;
      if (v === prev) opt.selected = true;
      select.appendChild(opt);
    });

    if (!select.value && vertices.length > 0) {
      select.value = vertices[0];
    }
  }

  async loadAlgorithmSteps() {
    const vertices = this.graph.getVertices();
    const display = document.getElementById('animStateDisplay');

    if (vertices.length === 0) {
      display.innerHTML = '<span style="color:var(--text-muted);">Please add nodes to the canvas or load a preset to run traversals.</span>';
      this.animationSteps = [];
      return;
    }

    const algo = document.getElementById('animAlgorithmSelect').value;
    const startVertex = document.getElementById('animStartVertexSelect').value || vertices[0];
    const gData = this.graph.toJSON();

    let res;
    try {
      if (algo === 'bfs') {
        res = await ApiService.runBFS(gData, startVertex);
      } else if (algo === 'dfs') {
        res = await ApiService.runDFS(gData, startVertex);
      } else if (algo === 'euler') {
        res = await ApiService.runEuler(gData, startVertex);
        if (res.trail && res.trail.steps) res.steps = res.trail.steps;
      } else if (algo === 'hamilton') {
        res = await ApiService.runHamilton(gData, startVertex);
        if (res.result && res.result.steps) res.steps = res.result.steps;
      }

      if (res && res.steps && res.steps.length > 0) {
        this.animationSteps = res.steps;
        this.currentStepIdx = 0;
        this.applyStep(this.currentStepIdx);
      } else {
        display.innerHTML = `<span style="color:var(--accent-rose);">${res?.error || 'No execution steps generated.'}</span>`;
      }
    } catch (e) {
      display.innerHTML = `<span style="color:var(--accent-rose);">Algorithm error: ${e.message}</span>`;
    }
  }

  applyStep(index) {
    if (!this.animationSteps || this.animationSteps.length === 0) return;
    const step = this.animationSteps[index];
    if (!step) return;

    const display = document.getElementById('animStateDisplay');
    const actionColor = step.action === 'COMPLETE' || step.action === 'CYCLE_FOUND' || step.action === 'PATH_FOUND'
      ? 'var(--accent-emerald)'
      : step.action === 'DEAD_END' || step.action === 'INELIGIBLE'
        ? 'var(--accent-rose)'
        : 'var(--accent-amber)';

    display.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="color:${actionColor}; font-weight:800; text-transform:uppercase; font-size:0.8rem;">
          <i class="fa-solid fa-play"></i> Step ${step.stepIndex}/${this.animationSteps.length}: ${step.action}
        </span>
        <span style="font-size:0.75rem; color:var(--text-muted);">
          ${Math.round(((index + 1) / this.animationSteps.length) * 100)}%
        </span>
      </div>
      <div style="color:#fff; margin-bottom:8px; line-height:1.4;">${step.description}</div>
      <div style="display:flex; flex-direction:column; gap:4px; font-size:0.8rem; background:rgba(0,0,0,0.3); padding:8px; border-radius:4px; border:1px solid var(--border-color);">
        ${step.queue ? `<div><strong style="color:var(--accent-cyan);">Queue:</strong> [${step.queue.join(', ')}]</div>` : ''}
        ${step.stack ? `<div><strong style="color:var(--accent-purple);">Stack / Path:</strong> [${step.stack.join(' → ')}]</div>` : ''}
        ${step.circuit ? `<div><strong style="color:var(--accent-emerald);">Euler Trail:</strong> [${step.circuit.join(' → ')}]</div>` : ''}
        ${step.visited ? `<div><strong style="color:var(--accent-amber);">Visited:</strong> {${step.visited.join(', ')}}</div>` : ''}
      </div>
    `;

    // Highlight active vertices and edge
    this.renderer.clearSelection();
    if (Array.isArray(step.visited)) {
      step.visited.forEach(v => this.renderer.selectedVertices.add(v));
    }
    if (Array.isArray(step.stack)) {
      step.stack.forEach(v => this.renderer.selectedVertices.add(v));
    }
    if (step.currentVertex) {
      this.renderer.selectedVertices.add(step.currentVertex);
    }
    if (step.activeEdge && Array.isArray(step.activeEdge)) {
      this.renderer.toggleSelectEdge(step.activeEdge[0], step.activeEdge[1]);
    }
    this.renderer.render();
  }

  stepNext() {
    if (this.currentStepIdx < this.animationSteps.length - 1) {
      this.currentStepIdx++;
      this.applyStep(this.currentStepIdx);
      this.sound.playClick();
    } else {
      this.pauseAnimation();
    }
  }

  stepPrev() {
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this.applyStep(this.currentStepIdx);
      this.sound.playClick();
    }
  }

  async playAnimation() {
    if (this.animationSteps.length === 0) {
      await this.loadAlgorithmSteps();
    }
    this.isPlaying = true;
    clearInterval(this.animTimer);
    this.animTimer = setInterval(() => {
      if (this.currentStepIdx < this.animationSteps.length - 1) {
        this.stepNext();
      } else {
        this.pauseAnimation();
      }
    }, this.speedMs);
  }

  pauseAnimation() {
    this.isPlaying = false;
    clearInterval(this.animTimer);
  }

  resetAnimation() {
    this.pauseAnimation();
    this.currentStepIdx = 0;
    this.renderer.clearSelection();
    this.renderer.render();
    if (this.animationSteps.length > 0) {
      this.applyStep(0);
    }
  }
}

/**
 * GraphQuest - Interactive SVG Graph Canvas Renderer
 * Supports drag-and-drop, path highlighting, edge selection & smooth animations
 */

export class GraphRenderer {
  /**
   * @param {SVGElement} svgElement 
   * @param {SVGGElement} edgesGroup 
   * @param {SVGGElement} verticesGroup 
   */
  constructor(svgElement, edgesGroup, verticesGroup) {
    this.svg = svgElement;
    this.edgesGroup = edgesGroup;
    this.verticesGroup = verticesGroup;

    this.graph = null;
    this.selectedVertices = new Set();
    this.selectedEdges = new Set();
    this.activePath = []; // Array of vertex names in order

    // Event hooks
    this.onVertexClick = null;
    this.onEdgeClick = null;
    this.onPositionChange = null;

    // Drag state
    this.draggedVertex = null;
    this.dragOffset = { x: 0, y: 0 };

    this.initDragListeners();
  }

  setGraph(graph) {
    this.graph = graph;
    this.selectedVertices.clear();
    this.selectedEdges.clear();
    this.activePath = [];
    this.ensureVertexPositions();
    this.render();
  }

  ensureVertexPositions() {
    if (!this.graph) return;
    const vertices = this.graph.getVertices();
    const viewBox = this.svg.viewBox.baseVal || { width: 600, height: 400 };
    const cx = (viewBox.width || 600) / 2;
    const cy = (viewBox.height || 400) / 2;
    const radius = Math.min(cx, cy) * 0.72;

    vertices.forEach((v, index) => {
      const existing = this.graph.getPosition(v);
      if (!existing || (existing.x === 300 && existing.y === 200 && vertices.length > 1)) {
        const angle = (2 * Math.PI * index) / vertices.length - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        this.graph.setPosition(v, Math.round(x), Math.round(y));
      }
    });
  }

  arrangeInCircle() {
    if (!this.graph) return;
    const vertices = this.graph.getVertices();
    const viewBox = this.svg.viewBox.baseVal || { width: 600, height: 400 };
    const cx = (viewBox.width || 600) / 2;
    const cy = (viewBox.height || 400) / 2;
    const radius = Math.min(cx, cy) * 0.7;

    vertices.forEach((v, index) => {
      const angle = (2 * Math.PI * index) / vertices.length - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      this.graph.setPosition(v, Math.round(x), Math.round(y));
    });
    this.render();
  }

  render() {
    if (!this.graph) return;

    // Clear SVG groups
    this.edgesGroup.innerHTML = '';
    this.verticesGroup.innerHTML = '';

    const edges = this.graph.getEdges();
    const vertices = this.graph.getVertices();

    // 1. Render Edges
    edges.forEach(([u, v]) => {
      const posU = this.graph.getPosition(u);
      const posV = this.graph.getPosition(v);

      const edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`;
      const isSelected = this.selectedEdges.has(edgeKey);
      const isActiveInPath = this.isEdgeInPath(u, v);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', posU.x);
      line.setAttribute('y1', posU.y);
      line.setAttribute('x2', posV.x);
      line.setAttribute('y2', posV.y);
      line.setAttribute('data-u', u);
      line.setAttribute('data-v', v);
      line.setAttribute('class', `graph-edge ${isSelected ? 'highlighted' : ''} ${isActiveInPath ? 'active-path' : ''}`);

      line.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onEdgeClick) this.onEdgeClick(u, v);
      });

      this.edgesGroup.appendChild(line);
    });

    // 2. Render Vertices
    vertices.forEach(v => {
      const pos = this.graph.getPosition(v);
      const isSelected = this.selectedVertices.has(v);
      const isActiveInPath = this.activePath.includes(v);
      const deg = this.graph.getDegree(v);

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `graph-vertex ${isSelected ? 'selected' : ''} ${isActiveInPath ? 'active-trail' : ''}`);
      g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
      g.setAttribute('data-vertex', v);

      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '22');
      circle.setAttribute('class', 'graph-vertex-circle');

      // Label text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'graph-vertex-label');
      text.textContent = v;

      // Degree badge
      const degText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      degText.setAttribute('class', 'graph-degree-badge');
      degText.setAttribute('x', '22');
      degText.setAttribute('y', '-16');
      degText.textContent = `d=${deg}`;

      g.appendChild(circle);
      g.appendChild(text);
      g.appendChild(degText);

      // Mouse interaction for drag and click
      g.addEventListener('mousedown', (e) => this.startDrag(e, v));
      g.addEventListener('touchstart', (e) => this.startDragTouch(e, v), { passive: false });

      g.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onVertexClick) this.onVertexClick(v);
      });

      this.verticesGroup.appendChild(g);
    });
  }

  isEdgeInPath(u, v) {
    if (this.activePath.length < 2) return false;
    for (let i = 0; i < this.activePath.length - 1; i++) {
      const a = this.activePath[i];
      const b = this.activePath[i + 1];
      if ((a === u && b === v) || (a === v && b === u)) return true;
    }
    return false;
  }

  setActivePath(path) {
    this.activePath = [...path];
    this.render();
  }

  toggleSelectVertex(v) {
    if (this.selectedVertices.has(v)) {
      this.selectedVertices.delete(v);
    } else {
      this.selectedVertices.add(v);
    }
    this.render();
  }

  toggleSelectEdge(u, v) {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    if (this.selectedEdges.has(key)) {
      this.selectedEdges.delete(key);
    } else {
      this.selectedEdges.add(key);
    }
    this.render();
  }

  clearSelection() {
    this.selectedVertices.clear();
    this.selectedEdges.clear();
    this.activePath = [];
    this.render();
  }

  // --- Drag & Drop Physics ---

  initDragListeners() {
    window.addEventListener('mousemove', (e) => this.onDragMove(e));
    window.addEventListener('mouseup', () => this.endDrag());

    window.addEventListener('touchmove', (e) => this.onDragMoveTouch(e), { passive: false });
    window.addEventListener('touchend', () => this.endDrag());
  }

  startDrag(e, vertex) {
    if (e.button !== 0) return; // Left click only
    this.draggedVertex = vertex;
    const pt = this.getSvgCoordinates(e.clientX, e.clientY);
    const pos = this.graph.getPosition(vertex);
    this.dragOffset = { x: pt.x - pos.x, y: pt.y - pos.y };
  }

  startDragTouch(e, vertex) {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    this.draggedVertex = vertex;
    const touch = e.touches[0];
    const pt = this.getSvgCoordinates(touch.clientX, touch.clientY);
    const pos = this.graph.getPosition(vertex);
    this.dragOffset = { x: pt.x - pos.x, y: pt.y - pos.y };
  }

  onDragMove(e) {
    if (!this.draggedVertex || !this.graph) return;
    const pt = this.getSvgCoordinates(e.clientX, e.clientY);
    const newX = Math.round(pt.x - this.dragOffset.x);
    const newY = Math.round(pt.y - this.dragOffset.y);
    this.graph.setPosition(this.draggedVertex, newX, newY);
    this.render();
    if (this.onPositionChange) this.onPositionChange(this.draggedVertex, newX, newY);
  }

  onDragMoveTouch(e) {
    if (!this.draggedVertex || !this.graph || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const pt = this.getSvgCoordinates(touch.clientX, touch.clientY);
    const newX = Math.round(pt.x - this.dragOffset.x);
    const newY = Math.round(pt.y - this.dragOffset.y);
    this.graph.setPosition(this.draggedVertex, newX, newY);
    this.render();
    if (this.onPositionChange) this.onPositionChange(this.draggedVertex, newX, newY);
  }

  endDrag() {
    this.draggedVertex = null;
  }

  getSvgCoordinates(clientX, clientY) {
    const pt = this.svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(this.svg.getScreenCTM().inverse());
  }
}

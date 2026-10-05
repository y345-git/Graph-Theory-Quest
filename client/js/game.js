/**
 * GraphQuest - Game Engine & Level Progression Controller
 * Discrete Mathematics (7MA206)
 */

import { Graph } from './graph.js';
import { GraphRenderer } from './renderer.js';
import { ApiService } from './api.js';

export class GameController {
  constructor(scoringService, soundService, onNavigate) {
    this.scoring = scoringService;
    this.sound = soundService;
    this.onNavigate = onNavigate;

    this.currentLevel = null;
    this.currentGraph = null;
    this.renderer = null;

    // Interaction state
    this.selectedChoiceIndex = null;
    this.tracedPath = [];
    this.selectedVertices = new Set();
    this.selectedEdge = null;
    this.hintsRevealed = 0;
    this.attemptsCount = 0;

    this.allWorlds = [];

    this.initDOM();
  }

  initDOM() {
    const svg = document.getElementById('gameSvgCanvas');
    const edgesG = document.getElementById('gameEdgesGroup');
    const verticesG = document.getElementById('gameVerticesGroup');

    this.renderer = new GraphRenderer(svg, edgesG, verticesG);

    // Event hooks for graph clicks
    this.renderer.onVertexClick = (vertex) => this.handleCanvasVertexClick(vertex);
    this.renderer.onEdgeClick = (u, v) => this.handleCanvasEdgeClick(u, v);

    // Buttons
    document.getElementById('submitAnswerBtn').addEventListener('click', () => this.submitAnswer());
    document.getElementById('returnToCampaignBtn').addEventListener('click', () => this.onNavigate('worlds'));
    document.getElementById('gameResetCanvasBtn').addEventListener('click', () => this.resetCanvasLayout());
    document.getElementById('undoPathNodeBtn').addEventListener('click', () => this.undoPathNode());
    document.getElementById('clearPathBtn').addEventListener('click', () => this.clearPath());
    document.getElementById('hintToggleBtn').addEventListener('click', () => this.revealNextHint());

    // Modal navigation buttons
    document.getElementById('modalBackToMapBtn').addEventListener('click', () => {
      this.closeModal();
      this.onNavigate('worlds');
    });

    document.getElementById('modalNextLevelBtn').addEventListener('click', () => {
      this.closeModal();
      this.advanceToNextLevel();
    });
  }

  async loadCampaignWorlds() {
    try {
      const data = await ApiService.getLevels();
      if (data.success) {
        this.allWorlds = data.worlds;
        this.renderWorldsMap();
      }
    } catch (e) {
      console.error('Failed to load campaign levels', e);
    }
  }

  renderWorldsMap() {
    const container = document.getElementById('worldsListContainer');
    container.innerHTML = '';

    this.allWorlds.forEach(world => {
      const isUnlocked = this.scoring.isWorldUnlocked(world.worldId);
      const card = document.createElement('div');
      card.className = `world-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      let completedCount = 0;
      const levelChips = world.levels.map(lvl => {
        const isDone = this.scoring.isLevelCompleted(lvl.id);
        const stars = this.scoring.getLevelStars(lvl.id);
        if (isDone) completedCount++;

        return `
          <div class="level-chip ${isDone ? 'completed' : ''}" data-level-id="${lvl.id}" ${isUnlocked ? '' : 'style="pointer-events:none;"'}>
            <span>${lvl.levelNumber}</span>
            ${isDone ? `<span style="color:var(--accent-amber);">${'★'.repeat(stars)}</span>` : ''}
          </div>
        `;
      }).join('');

      const percent = Math.round((completedCount / world.levels.length) * 100);

      card.innerHTML = `
        <div>
          <div class="world-card-top">
            <span class="world-badge ${isUnlocked ? 'unlocked' : 'locked'}">
              ${isUnlocked ? '<i class="fa-solid fa-lock-open"></i> Unlocked' : '<i class="fa-solid fa-lock"></i> Locked'}
            </span>
            <span style="font-size: 0.8rem; color: var(--accent-cyan); font-weight:700;">World ${world.worldId}/10</span>
          </div>
          <h3>${world.worldTitle}</h3>
          <p>${world.levels.length} Interactive Discrete Mathematics Stages</p>
          <div class="world-progress-bar">
            <div class="world-progress-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="world-levels-list">
            ${levelChips}
          </div>
        </div>
        <div>
          ${isUnlocked
            ? `<button class="btn btn-primary btn-sm play-world-btn" data-first-level="${world.levels[0].id}"><i class="fa-solid fa-play"></i> Play World</button>`
            : `<button class="btn btn-secondary btn-sm" disabled><i class="fa-solid fa-lock"></i> Locked (Earn XP)</button>`
          }
        </div>
      `;

      // Level chip click listeners
      card.querySelectorAll('.level-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const levelId = parseInt(chip.dataset.levelId, 10);
          this.startLevel(levelId);
        });
      });

      const playBtn = card.querySelector('.play-world-btn');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          const firstLvlId = parseInt(playBtn.dataset.firstLevel, 10);
          this.startLevel(firstLvlId);
        });
      }

      container.appendChild(card);
    });
  }

  async startLevel(levelId) {
    try {
      const res = await ApiService.getLevelById(levelId);
      if (!res.success) return;

      this.currentLevel = res.level;
      this.currentGraph = Graph.fromJSON(this.currentLevel.graph);
      this.selectedChoiceIndex = null;
      this.tracedPath = [];
      this.selectedVertices.clear();
      this.selectedEdge = null;
      this.hintsRevealed = 0;
      this.attemptsCount = 0;

      // Update UI
      document.getElementById('gameLevelTitle').textContent = `Level ${this.currentLevel.levelNumber}: ${this.currentLevel.title}`;
      document.getElementById('gameConceptTag').innerHTML = `<i class="fa-solid fa-lightbulb"></i> Concept: ${this.currentLevel.concept}`;
      document.getElementById('gameTheoryContent').textContent = this.currentLevel.theory;
      document.getElementById('gamePromptBanner').textContent = this.currentLevel.question;
      document.getElementById('xpRewardBadge').textContent = `+${this.currentLevel.xp} XP`;
      document.getElementById('gameReasoningBox').className = 'reasoning-box';
      document.getElementById('gameReasoningBox').textContent = 'Interact with the graph or select options above, then click Submit.';

      // Render math formulas in theory box
      if (window.renderMathInElement) {
        window.renderMathInElement(document.getElementById('gameTheoryBox'), {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }

      // Reset Hints Card
      const hintSection = document.getElementById('hintSectionCard');
      hintSection.style.display = 'none';
      document.getElementById('hintsContainer').innerHTML = '';

      // Configure Interaction Panel
      this.setupInteractionPanel();

      // Render graph on canvas
      this.renderer.setGraph(this.currentGraph);

      this.onNavigate('game');
    } catch (e) {
      console.error('Failed to start level', e);
    }
  }

  setupInteractionPanel() {
    const mcContainer = document.getElementById('multipleChoiceContainer');
    const pathContainer = document.getElementById('pathTraceContainer');
    const degContainer = document.getElementById('degreeInputContainer');

    mcContainer.style.display = 'none';
    pathContainer.style.display = 'none';
    degContainer.style.display = 'none';

    switch (this.currentLevel.interactionType) {
      case 'MULTIPLE_CHOICE': {
        mcContainer.style.display = 'flex';
        mcContainer.innerHTML = '';
        this.currentLevel.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'choice-btn';
          btn.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + idx)}</span> <span>${opt}</span>`;
          btn.addEventListener('click', () => {
            mcContainer.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            this.selectedChoiceIndex = idx;
            this.sound.playClick();
          });
          mcContainer.appendChild(btn);
        });
        break;
      }

      case 'PATH_TRACE': {
        pathContainer.style.display = 'block';
        this.updatePathReadout();
        break;
      }

      case 'DEGREE_INPUT': {
        degContainer.style.display = 'block';
        const input = document.getElementById('degreeInputField');
        input.value = '';
        input.focus();
        break;
      }

      case 'VERTEX_SELECT':
      case 'EDGE_SELECT':
      default:
        // Handled on canvas
        break;
    }
  }

  handleCanvasVertexClick(vertex) {
    this.sound.playClick();

    if (this.currentLevel.interactionType === 'PATH_TRACE') {
      this.tracedPath.push(vertex);
      this.renderer.setActivePath(this.tracedPath);
      this.updatePathReadout();
    } else if (this.currentLevel.interactionType === 'VERTEX_SELECT') {
      if (this.selectedVertices.has(vertex)) {
        this.selectedVertices.delete(vertex);
      } else {
        this.selectedVertices.add(vertex);
      }
      this.renderer.toggleSelectVertex(vertex);
    }
  }

  handleCanvasEdgeClick(u, v) {
    this.sound.playClick();
    if (this.currentLevel.interactionType === 'EDGE_SELECT') {
      this.selectedEdge = [u, v];
      this.renderer.clearSelection();
      this.renderer.toggleSelectEdge(u, v);
    }
  }

  updatePathReadout() {
    const readout = document.getElementById('pathTraceReadout');
    if (this.tracedPath.length === 0) {
      readout.textContent = 'Click vertices on the graph canvas in sequence...';
      readout.style.color = 'var(--text-muted)';
    } else {
      readout.textContent = this.tracedPath.join(' → ');
      readout.style.color = 'var(--accent-emerald)';
    }
  }

  undoPathNode() {
    if (this.tracedPath.length > 0) {
      this.tracedPath.pop();
      this.renderer.setActivePath(this.tracedPath);
      this.updatePathReadout();
      this.sound.playClick();
    }
  }

  clearPath() {
    this.tracedPath = [];
    this.renderer.setActivePath([]);
    this.updatePathReadout();
    this.sound.playClick();
  }

  resetCanvasLayout() {
    this.renderer.ensureVertexPositions();
    this.renderer.render();
  }

  revealNextHint() {
    if (!this.currentLevel || !this.currentLevel.hints) return;
    if (this.hintsRevealed >= this.currentLevel.hints.length) {
      alert('All hints have already been unlocked for this stage.');
      return;
    }

    const hintText = this.currentLevel.hints[this.hintsRevealed];
    this.hintsRevealed++;

    // Deduct 5 XP penalty
    this.scoring.deductHintPenalty(5);
    this.sound.playHint();

    const hintSection = document.getElementById('hintSectionCard');
    hintSection.style.display = 'block';

    const hintCard = document.createElement('div');
    hintCard.className = 'hint-content-card';
    hintCard.style.marginBottom = '6px';
    hintCard.innerHTML = `<strong>Hint ${this.hintsRevealed}:</strong> ${hintText}`;
    document.getElementById('hintsContainer').appendChild(hintCard);
  }

  async submitAnswer() {
    if (!this.currentLevel) return;
    this.attemptsCount++;

    let answerPayload;
    switch (this.currentLevel.interactionType) {
      case 'MULTIPLE_CHOICE':
        if (this.selectedChoiceIndex === null) {
          alert('Please select an option before submitting.');
          return;
        }
        answerPayload = this.selectedChoiceIndex;
        break;

      case 'PATH_TRACE':
        if (this.tracedPath.length === 0) {
          alert('Please trace a path on the canvas before submitting.');
          return;
        }
        answerPayload = this.tracedPath;
        break;

      case 'DEGREE_INPUT': {
        const val = document.getElementById('degreeInputField').value;
        if (val === '') {
          alert('Please enter a degree value.');
          return;
        }
        answerPayload = parseInt(val, 10);
        break;
      }

      case 'VERTEX_SELECT':
        if (this.selectedVertices.size === 0) {
          alert('Please click and select vertices on the canvas.');
          return;
        }
        answerPayload = Array.from(this.selectedVertices);
        break;

      case 'EDGE_SELECT':
        if (!this.selectedEdge) {
          alert('Please click on an edge on the canvas.');
          return;
        }
        answerPayload = this.selectedEdge;
        break;

      case 'MASTER_ANALYSIS':
        answerPayload = this.currentLevel.correctAnswers;
        break;
      default:
        answerPayload = null;
    }

    try {
      const res = await ApiService.validateLevelAnswer(this.currentLevel.id, answerPayload);
      const reasoningBox = document.getElementById('gameReasoningBox');

      if (res.isCorrect) {
        reasoningBox.className = 'reasoning-box success';
        reasoningBox.innerHTML = `<strong>Evaluation Success:</strong><br>${res.explanation}`;
        this.sound.playWin();

        // Calculate stars (3 stars = <=1 attempt, 0 hints; 2 stars = <=2 attempts; 1 star otherwise)
        let stars = 3;
        if (this.hintsRevealed > 1 || this.attemptsCount > 2) stars = 1;
        else if (this.hintsRevealed > 0 || this.attemptsCount > 1) stars = 2;

        this.scoring.recordLevelCompletion(
          this.currentLevel.id,
          this.currentLevel.worldId,
          stars,
          this.currentLevel.xp
        );

        this.showLevelCompleteModal(stars, this.currentLevel.xp, res.explanation);
      } else {
        reasoningBox.className = 'reasoning-box error';
        reasoningBox.innerHTML = `<strong>Evaluation Failed:</strong><br>${res.explanation}`;
        this.sound.playError();
      }
    } catch (e) {
      console.error('Validation submission failed', e);
    }
  }

  showLevelCompleteModal(stars, xpEarned, explanation) {
    const modal = document.getElementById('levelCompleteModal');
    document.getElementById('modalStarsBurst').textContent = '⭐'.repeat(stars);
    document.getElementById('modalLevelCompleteTitle').textContent = `Level ${this.currentLevel.levelNumber} Mastered!`;
    document.getElementById('modalLevelCompleteMessage').textContent = explanation;
    document.getElementById('modalXpEarned').textContent = `+${xpEarned}`;
    document.getElementById('modalTotalStars').textContent = this.scoring.getStars();

    modal.classList.add('active');
  }

  closeModal() {
    document.getElementById('levelCompleteModal').classList.remove('active');
  }

  advanceToNextLevel() {
    const currId = this.currentLevel.id;
    let nextLvlId = null;

    for (let w = 0; w < this.allWorlds.length; w++) {
      const world = this.allWorlds[w];
      const idx = world.levels.findIndex(l => l.id === currId);
      if (idx !== -1) {
        if (idx + 1 < world.levels.length) {
          nextLvlId = world.levels[idx + 1].id;
        } else if (w + 1 < this.allWorlds.length) {
          nextLvlId = this.allWorlds[w + 1].levels[0].id;
        }
        break;
      }
    }

    if (nextLvlId) {
      this.startLevel(nextLvlId);
    } else {
      alert('Congratulations! You have completed all levels in GraphQuest!');
      this.onNavigate('worlds');
    }
  }
}

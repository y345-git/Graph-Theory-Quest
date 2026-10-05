/**
 * GraphQuest - Main Frontend Application Entry Point
 * Discrete Mathematics (7MA206) - Gamified Graph Theory System
 */

import { ScoringService } from './scoring.js';
import { GameController } from './game.js';
import { LabController } from './lab.js';
import { TheoryContent, renderTheoryTopic } from './theory.js';

/**
 * Web Audio API Synthesizer for Zero-Dependency Sound FX
 */
class SoundService {
  constructor(scoringService) {
    this.scoring = scoringService;
    this.ctx = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (!this.scoring.isSoundEnabled()) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playClick() {
    this.playTone(600, 'triangle', 0.05, 0.1);
  }

  playWin() {
    this.playTone(523.25, 'sine', 0.15, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.2), 120); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.2), 240); // G5
    setTimeout(() => this.playTone(1046.50, 'sine', 0.4, 0.25), 360); // C6
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.3, 0.15), 150);
  }

  playHint() {
    this.playTone(880, 'sine', 0.15, 0.12);
  }
}

class App {
  constructor() {
    this.scoring = new ScoringService();
    this.sound = new SoundService(this.scoring);
    this.activeView = 'home';

    this.game = new GameController(this.scoring, this.sound, (view) => this.navigateTo(view));
    this.lab = new LabController(this.sound);

    this.initNavigation();
    this.initTheory();
    this.initAudioToggle();
    this.updateStatsBar();
    this.game.loadCampaignWorlds();
  }

  initNavigation() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        this.navigateTo(view);
      });
    });

    // Brand logo returns to home
    document.getElementById('brandBtn').addEventListener('click', () => this.navigateTo('home'));

    // Hero CTAs
    document.getElementById('startCampaignBtn').addEventListener('click', () => this.navigateTo('worlds'));
    document.getElementById('openLabBtn').addEventListener('click', () => this.navigateTo('lab'));
    document.getElementById('openTheoryBtn').addEventListener('click', () => this.navigateTo('theory'));

    // Reset progress button
    document.getElementById('resetProgressBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all player progress and stars?')) {
        this.scoring.resetProgress();
        this.updateStatsBar();
        this.renderBadges();
        this.game.loadCampaignWorlds();
      }
    });
  }

  initTheory() {
    // Theory sidebar clicks
    document.querySelectorAll('.theory-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.theory-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const topic = item.dataset.topic;
        renderTheoryTopic(topic);
        this.sound.playClick();
      });
    });

    // Render initial topic
    renderTheoryTopic('intro');
  }

  initAudioToggle() {
    const btn = document.getElementById('audioToggleBtn');
    btn.addEventListener('click', () => {
      const enabled = this.scoring.toggleSound();
      btn.innerHTML = enabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
      btn.style.color = enabled ? 'var(--accent-cyan)' : 'var(--text-muted)';
    });
  }

  navigateTo(viewName) {
    this.sound.playClick();
    this.activeView = viewName;

    // Switch active view container
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add('active');

    // Update nav tab highlight
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.dataset.view === viewName) tab.classList.add('active');
      else tab.classList.remove('active');
    });

    // View specific hooks
    if (viewName === 'worlds') {
      this.game.renderWorldsMap();
    } else if (viewName === 'progress') {
      this.renderBadges();
    }

    this.updateStatsBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStatsBar() {
    document.getElementById('playerXpDisplay').textContent = this.scoring.getXp();
    document.getElementById('playerStarsDisplay').textContent = this.scoring.getStars();
    document.getElementById('playerRankDisplay').textContent = this.scoring.getRank();
    document.getElementById('profileRankTitle').textContent = `Rank: ${this.scoring.getRank()} (${this.scoring.getXp()} XP)`;
  }

  renderBadges() {
    const container = document.getElementById('badgesContainer');
    container.innerHTML = '';
    const badges = this.scoring.getBadges();

    badges.forEach(badge => {
      const card = document.createElement('div');
      card.className = `badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon-box">${badge.icon}</div>
        <div class="badge-text">
          <h4>${badge.title}</h4>
          <p>${badge.desc}</p>
          <span style="font-size:0.75rem; font-weight:700; color:${badge.unlocked ? 'var(--accent-emerald)' : 'var(--text-muted)'};">
            ${badge.unlocked ? '✓ Unlocked' : '🔒 Locked'}
          </span>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

// Initialize Application once DOM loads
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

/**
 * GraphQuest - Player Progress, XP, Stars and Achievements Storage
 * Discrete Mathematics (7MA206)
 */

const STORAGE_KEY = 'graphquest_player_progress_v1';

const INITIAL_STATE = {
  xp: 0,
  stars: 0,
  unlockedWorlds: [1], // World 1 unlocked by default
  completedLevels: {}, // { [levelId]: { stars: 3, xp: 100, attempts: 1 } }
  badges: {
    first_step: { id: 'first_step', title: 'First Discovery', desc: 'Completed your first graph puzzle', icon: '🌱', unlocked: false },
    degree_detective: { id: 'degree_detective', title: 'Degree Detective', desc: 'Mastered vertex degrees & Handshaking Lemma', icon: '🔍', unlocked: false },
    matrix_architect: { id: 'matrix_architect', title: 'Matrix Architect', desc: 'Constructed an accurate Adjacency Matrix', icon: '📐', unlocked: false },
    pathfinder: { id: 'pathfinder', title: 'Pathfinder', desc: 'Distinguished between Walks, Trails, and Simple Paths', icon: '🧭', unlocked: false },
    bfs_pioneer: { id: 'bfs_pioneer', title: 'BFS Pioneer', desc: 'Mastered queue-based level exploration', icon: '⚡', unlocked: false },
    eulerian_explorer: { id: 'eulerian_explorer', title: 'Eulerian Explorer', desc: 'Solved the Königsberg Bridge & Euler tours', icon: '🌉', unlocked: false },
    hamiltonian_hero: { id: 'hamiltonian_hero', title: 'Hamiltonian Hero', desc: 'Conquered NP-Complete Hamiltonian Cycles', icon: '👑', unlocked: false },
    grandmaster: { id: 'grandmaster', title: 'Graph Theory Grandmaster', desc: 'Completed all 10 Campaign Worlds', icon: '🏆', unlocked: false }
  },
  soundEnabled: true
};

export class ScoringService {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...INITIAL_STATE, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Failed to load player progress from localStorage', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist progress to localStorage', e);
    }
  }

  getXp() {
    return this.state.xp;
  }

  getStars() {
    return this.state.stars;
  }

  getRank() {
    const xp = this.state.xp;
    if (xp >= 2000) return 'Grandmaster';
    if (xp >= 1400) return 'Graph Theorist';
    if (xp >= 900) return 'Pathfinder';
    if (xp >= 500) return 'Network Explorer';
    if (xp >= 200) return 'Apprentice';
    return 'Novice';
  }

  isWorldUnlocked(worldId) {
    return this.state.unlockedWorlds.includes(Number(worldId));
  }

  isLevelCompleted(levelId) {
    return Boolean(this.state.completedLevels[levelId]);
  }

  getLevelStars(levelId) {
    return this.state.completedLevels[levelId]?.stars || 0;
  }

  recordLevelCompletion(levelId, worldId, starsEarned, xpEarned) {
    const prev = this.state.completedLevels[levelId];
    const prevStars = prev ? prev.stars : 0;
    const starDelta = Math.max(0, starsEarned - prevStars);

    this.state.completedLevels[levelId] = {
      stars: Math.max(prevStars, starsEarned),
      xp: (prev ? prev.xp : 0) + xpEarned,
      completedAt: new Date().toISOString()
    };

    this.state.xp += xpEarned;
    this.state.stars += starDelta;

    // Unlock next world when applicable
    const nextWorld = Number(worldId) + 1;
    if (nextWorld <= 10 && !this.state.unlockedWorlds.includes(nextWorld)) {
      this.state.unlockedWorlds.push(nextWorld);
    }

    // Check badges
    this.evaluateBadges(worldId);
    this.saveState();

    return {
      totalXp: this.state.xp,
      totalStars: this.state.stars,
      rank: this.getRank()
    };
  }

  deductHintPenalty(amount = 5) {
    this.state.xp = Math.max(0, this.state.xp - amount);
    this.saveState();
  }

  evaluateBadges(worldId) {
    const w = Number(worldId);
    this.state.badges.first_step.unlocked = true;

    if (w >= 3) this.state.badges.degree_detective.unlocked = true;
    if (w >= 4) this.state.badges.matrix_architect.unlocked = true;
    if (w >= 5) this.state.badges.pathfinder.unlocked = true;
    if (w >= 7) this.state.badges.bfs_pioneer.unlocked = true;
    if (w >= 8) this.state.badges.eulerian_explorer.unlocked = true;
    if (w >= 9) this.state.badges.hamiltonian_hero.unlocked = true;
    if (w >= 10 && Object.keys(this.state.completedLevels).length >= 10) {
      this.state.badges.grandmaster.unlocked = true;
    }
  }

  getBadges() {
    return Object.values(this.state.badges);
  }

  resetProgress() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }

  toggleSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.saveState();
    return this.state.soundEnabled;
  }

  isSoundEnabled() {
    return this.state.soundEnabled;
  }
}

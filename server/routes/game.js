/**
 * GraphQuest - Game and Level Progression API Routes
 * Discrete Mathematics (7MA206) - Game Controller
 */

const express = require('express');
const router = express.Router();
const levelsData = require('../data/levels.json');
const Graph = require('../algorithms/graph');
const { validateEulerWalk } = require('../algorithms/euler');
const { validateHamiltonWalk } = require('../algorithms/hamilton');

/**
 * GET /api/game/levels
 * Return all level metadata grouped by world
 */
router.get('/levels', (req, res) => {
  try {
    const worldsMap = {};

    levelsData.forEach(lvl => {
      if (!worldsMap[lvl.worldId]) {
        worldsMap[lvl.worldId] = {
          worldId: lvl.worldId,
          worldTitle: lvl.worldTitle,
          levels: []
        };
      }
      worldsMap[lvl.worldId].levels.push({
        id: lvl.id,
        levelNumber: lvl.levelNumber,
        title: lvl.title,
        concept: lvl.concept,
        xp: lvl.xp,
        interactionType: lvl.interactionType
      });
    });

    const worlds = Object.values(worldsMap);
    return res.json({ success: true, worlds, totalLevels: levelsData.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/game/levels/:levelId
 * Fetch full data for a single level
 */
router.get('/levels/:levelId', (req, res) => {
  try {
    const levelId = parseInt(req.params.levelId, 10);
    const level = levelsData.find(l => l.id === levelId);

    if (!level) {
      return res.status(404).json({ error: `Level with ID ${levelId} not found.` });
    }

    return res.json({ success: true, level });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/game/validate
 * Validates player answer against mathematical truth
 */
router.post('/validate', (req, res) => {
  try {
    const { levelId, answer } = req.body;
    const level = levelsData.find(l => l.id === parseInt(levelId, 10));

    if (!level) {
      return res.status(404).json({ error: `Level ${levelId} not found.` });
    }

    let isCorrect = false;
    let explanation = level.explanation || '';
    let details = {};

    switch (level.interactionType) {
      case 'MULTIPLE_CHOICE': {
        isCorrect = parseInt(answer, 10) === level.correctAnswer;
        if (!isCorrect) {
          explanation = `Incorrect. The correct option is: "${level.options[level.correctAnswer]}". ${level.hints[0]}`;
        }
        break;
      }

      case 'DEGREE_INPUT': {
        isCorrect = parseInt(answer, 10) === level.correctAnswer;
        if (!isCorrect) {
          explanation = `Incorrect. The degree of vertex ${level.targetVertex} is ${level.correctAnswer}. Remember: Degree = number of incident edges.`;
        }
        break;
      }

      case 'EDGE_SELECT': {
        if (Array.isArray(answer) && answer.length === 2) {
          const expected = level.correctAnswer;
          isCorrect = (answer[0] === expected[0] && answer[1] === expected[1]) ||
                      (answer[0] === expected[1] && answer[1] === expected[0]);
        }
        if (!isCorrect) {
          explanation = 'Please click the edge connecting the two vertices.';
        }
        break;
      }

      case 'VERTEX_SELECT': {
        if (Array.isArray(answer)) {
          const expected = [...level.correctAnswer].sort();
          const submitted = [...answer].sort();
          isCorrect = expected.length === submitted.length &&
                      expected.every((val, idx) => val === submitted[idx]);
        }
        if (!isCorrect) {
          explanation = `Vertices required: [${level.correctAnswer.join(', ')}]. You selected: [${Array.isArray(answer) ? answer.join(', ') : ''}].`;
        }
        break;
      }

      case 'PATH_TRACE': {
        const g = Graph.fromJSON(level.graph);
        if (level.targetType === 'EULER_PATH') {
          const vRes = validateEulerWalk(g, answer, 'PATH');
          isCorrect = vRes.isValid;
          explanation = vRes.reason;
          details = vRes;
        } else if (level.targetType === 'EULER_CIRCUIT') {
          const vRes = validateEulerWalk(g, answer, 'CIRCUIT');
          isCorrect = vRes.isValid;
          explanation = vRes.reason;
          details = vRes;
        } else if (level.targetType === 'HAMILTON_PATH') {
          const vRes = validateHamiltonWalk(g, answer, 'PATH');
          isCorrect = vRes.isValid;
          explanation = vRes.reason;
          details = vRes;
        } else if (level.targetType === 'HAMILTON_CYCLE') {
          const vRes = validateHamiltonWalk(g, answer, 'CYCLE');
          isCorrect = vRes.isValid;
          explanation = vRes.reason;
          details = vRes;
        } else if (level.targetType === 'CYCLE') {
          // Simple Cycle
          if (Array.isArray(answer) && answer.length >= 4 && answer[0] === answer[answer.length - 1]) {
            let valid = true;
            for (let i = 0; i < answer.length - 1; i++) {
              if (!g.hasEdge(answer[i], answer[i + 1])) {
                valid = false;
                break;
              }
            }
            isCorrect = valid;
            explanation = valid ? 'Valid Cycle!' : 'Invalid edges in cycle.';
          } else {
            isCorrect = false;
            explanation = 'Cycle must start and end at the same vertex and have at least 3 distinct edges.';
          }
        } else {
          // Simple path
          if (Array.isArray(answer) && answer.length >= 2) {
            const seen = new Set();
            let valid = true;
            for (let i = 0; i < answer.length; i++) {
              if (seen.has(answer[i])) { valid = false; break; }
              seen.add(answer[i]);
              if (i > 0 && !g.hasEdge(answer[i - 1], answer[i])) { valid = false; break; }
            }
            if (level.startVertex && answer[0] !== level.startVertex) valid = false;
            if (level.endVertex && answer[answer.length - 1] !== level.endVertex) valid = false;
            isCorrect = valid;
            explanation = valid ? 'Valid Simple Path!' : 'Path must not repeat vertices and connect start to end.';
          }
        }
        break;
      }

      case 'MASTER_ANALYSIS': {
        const expected = level.correctAnswers;
        isCorrect = answer &&
          Number(answer.order) === expected.order &&
          Number(answer.size) === expected.size &&
          Boolean(answer.isConnected) === expected.isConnected &&
          String(answer.eulerType) === expected.eulerType &&
          Boolean(answer.hasHamiltonCycle) === expected.hasHamiltonCycle;

        if (!isCorrect) {
          explanation = `Evaluation: |V|=${expected.order}, |E|=${expected.size}, Connected=${expected.isConnected}, Euler=${expected.eulerType}, Hamilton=${expected.hasHamiltonCycle}.`;
        }
        break;
      }

      default:
        isCorrect = false;
    }

    return res.json({
      success: true,
      isCorrect,
      explanation,
      xpEarned: isCorrect ? level.xp : 0,
      details
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

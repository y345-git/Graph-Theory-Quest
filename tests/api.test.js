const request = require('supertest');
const app = require('../server/server');

describe('Software Architecture: GraphQuest REST API Integration Tests', () => {
  test('GET /api/health returns online status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ONLINE');
  });

  test('POST /api/graph/analyze computes full mathematical properties', async () => {
    const payload = {
      vertices: ['A', 'B', 'C', 'D'],
      edges: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']]
    };

    const res = await request(app)
      .post('/api/graph/analyze')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analysis.order).toBe(4);
    expect(res.body.analysis.size).toBe(4);
    expect(res.body.analysis.isConnected).toBe(true);
    expect(res.body.analysis.handshaking.holds).toBe(true);
    expect(res.body.analysis.euler.hasEulerCircuit).toBe(true);
  });

  test('POST /api/graph/bfs returns step-by-step traversal', async () => {
    const payload = {
      vertices: ['A', 'B', 'C'],
      edges: [['A', 'B'], ['B', 'C']],
      startVertex: 'A'
    };

    const res = await request(app)
      .post('/api/graph/bfs')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.traversalOrder).toEqual(['A', 'B', 'C']);
    expect(res.body.steps.length).toBeGreaterThan(0);
  });

  test('GET /api/game/levels loads all worlds and levels', async () => {
    const res = await request(app).get('/api/game/levels');
    expect(res.statusCode).toBe(200);
    expect(res.body.worlds.length).toBeGreaterThanOrEqual(10);
    expect(res.body.totalLevels).toBeGreaterThanOrEqual(20);
  });

  test('POST /api/game/validate validates multiple choice answer', async () => {
    const res = await request(app)
      .post('/api/game/validate')
      .send({ levelId: 101, answer: 0 });

    expect(res.statusCode).toBe(200);
    expect(res.body.isCorrect).toBe(true);
    expect(res.body.xpEarned).toBe(50);
  });
});

import { test, beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';
import { itemStore } from '../src/data/items.js';

describe('REST API Tests', () => {
  beforeEach(() => {
    itemStore.reset();
  });

  describe('Root and Health Endpoints', () => {
    test('GET / returns API welcome info', async () => {
      const res = await request(app).get('/');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'running');
      assert.ok(res.body.endpoints);
    });

    test('GET /api/v1/health returns ok status', async () => {
      const res = await request(app).get('/api/v1/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.ok(typeof res.body.uptime === 'number');
    });
  });

  describe('Items CRUD Endpoints', () => {
    test('GET /api/v1/items returns list of items', async () => {
      const res = await request(app).get('/api/v1/items');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.count, 3);
      assert.equal(Array.isArray(res.body.data), true);
    });

    test('GET /api/v1/items?completed=true filters completed items', async () => {
      const res = await request(app).get('/api/v1/items?completed=true');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.count, 1);
      assert.equal(res.body.data[0].id, 1);
    });

    test('GET /api/v1/items?search=deploy searches items by keyword', async () => {
      const res = await request(app).get('/api/v1/items?search=deploy');
      assert.equal(res.status, 200);
      assert.equal(res.body.count, 1);
      assert.equal(res.body.data[0].id, 3);
    });

    test('GET /api/v1/items/:id returns item by id', async () => {
      const res = await request(app).get('/api/v1/items/1');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 1);
    });

    test('GET /api/v1/items/:id returns 404 for unknown id', async () => {
      const res = await request(app).get('/api/v1/items/999');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'Not Found');
    });

    test('POST /api/v1/items creates a new item', async () => {
      const newItem = {
        title: 'New API Feature',
        description: 'Implement pagination and sorting',
        completed: false
      };

      const res = await request(app)
        .post('/api/v1/items')
        .send(newItem);

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, newItem.title);
      assert.equal(res.body.data.description, newItem.description);
      assert.equal(res.body.data.completed, false);
      assert.ok(res.body.data.id);
    });

    test('POST /api/v1/items returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/v1/items')
        .send({ description: 'Missing title field' });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'Bad Request');
    });

    test('PUT /api/v1/items/:id updates existing item', async () => {
      const res = await request(app)
        .put('/api/v1/items/2')
        .send({ title: 'Updated unit test title', completed: true });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, 'Updated unit test title');
      assert.equal(res.body.data.completed, true);
      assert.ok(res.body.data.updatedAt);
    });

    test('PUT /api/v1/items/:id returns 404 when updating non-existent item', async () => {
      const res = await request(app)
        .put('/api/v1/items/999')
        .send({ title: 'Non-existent item' });

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });

    test('DELETE /api/v1/items/:id deletes an item', async () => {
      const res = await request(app).delete('/api/v1/items/1');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);

      // Verify item was deleted
      const verifyRes = await request(app).get('/api/v1/items/1');
      assert.equal(verifyRes.status, 404);
    });

    test('DELETE /api/v1/items/:id returns 404 for non-existent item', async () => {
      const res = await request(app).delete('/api/v1/items/999');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  describe('Error Handling', () => {
    test('returns 404 JSON for undefined routes', async () => {
      const res = await request(app).get('/api/v1/non-existent-route');
      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Not Found');
    });
  });
});

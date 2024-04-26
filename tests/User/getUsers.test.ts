import request from 'supertest';

import * as db from '../databaseMock';
import app from '../../app';

describe('GET /v1/users', () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clearDatabase();
  });

  afterEach(async () => {
    await db.closeDatabase();
  });

  it('returns users array properly when called', async () =>
    request(app)
      .get('/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.statusCode).toBe(200);
      }));
});

const request = require('supertest');
const { app, resetState } = require('./index');

beforeEach(() => resetState());

describe('GET /jobs', () => {
  it('returns an empty array when no jobs exist', async () => {
    const res = await request(app).get('/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all jobs after some are created', async () => {
    await request(app).post('/jobs').send({ title: 'Dev', company: 'Acme', location: 'Remote' });
    await request(app).post('/jobs').send({ title: 'QA', company: 'Acme', location: 'NYC' });
    const res = await request(app).get('/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /jobs', () => {
  it('creates a job and returns 201 with the new job', async () => {
    const res = await request(app)
      .post('/jobs')
      .send({ title: 'Engineer', company: 'Initech', location: 'Austin' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: 'Engineer', company: 'Initech', location: 'Austin' });
  });

  it('assigns incrementing ids to successive jobs', async () => {
    const r1 = await request(app).post('/jobs').send({ title: 'A', company: 'B', location: 'C' });
    const r2 = await request(app).post('/jobs').send({ title: 'D', company: 'E', location: 'F' });
    expect(r1.body.id).toBe(1);
    expect(r2.body.id).toBe(2);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/jobs').send({ title: 'Intern' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title, company, and location are required' });
  });

  it('returns 400 when body is completely empty', async () => {
    const res = await request(app).post('/jobs').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'title, company, and location are required' });
  });
});

describe('GET /jobs/:id', () => {
  it('returns the job for an existing id', async () => {
    await request(app).post('/jobs').send({ title: 'Designer', company: 'Foo', location: 'LA' });
    const res = await request(app).get('/jobs/1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, title: 'Designer' });
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/jobs/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});

describe('DELETE /jobs/:id', () => {
  it('deletes an existing job and returns 204', async () => {
    await request(app).post('/jobs').send({ title: 'PM', company: 'Bar', location: 'SF' });
    const del = await request(app).delete('/jobs/1');
    expect(del.status).toBe(204);
    const list = await request(app).get('/jobs');
    expect(list.body).toHaveLength(0);
  });

  it('returns 404 when deleting a non-existent id', async () => {
    const res = await request(app).delete('/jobs/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });

  it('only removes the targeted job, leaving others intact', async () => {
    await request(app).post('/jobs').send({ title: 'A', company: 'X', location: 'Y' });
    await request(app).post('/jobs').send({ title: 'B', company: 'X', location: 'Y' });
    await request(app).delete('/jobs/1');
    const list = await request(app).get('/jobs');
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(2);
  });
});

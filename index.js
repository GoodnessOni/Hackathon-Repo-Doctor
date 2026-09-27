const express = require('express');
const app = express();
app.use(express.json());

let jobs = [];
let nextId = 1;

app.get('/jobs', (req, res) => {
  res.json(jobs);
});

app.post('/jobs', (req, res) => {
  const { title, company, location } = req.body;
  if (!title || !company || !location) {
    return res.status(400).json({ error: 'title, company, and location are required' });
  }
  const job = { id: nextId++, title, company, location };
  jobs.push(job);
  res.status(201).json(job);
});

app.get('/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

app.delete('/jobs/:id', (req, res) => {
  const idx = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  jobs.splice(idx, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('running on 3000'));
}

module.exports = { app, jobs, resetState: () => { jobs.length = 0; nextId = 1; } };

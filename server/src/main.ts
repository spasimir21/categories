import sqlite3 from 'sqlite3';
import express from 'express';

const db = new sqlite3.Database('./database.db');

// db.run(`
//   CREATE TABLE \`categories\` (
//     \`Name\` TEXT(256),
//     \`ID\` TEXT(256),
//     PRIMARY KEY (\`ID\`)
//   );
// `);

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  db.serialize(() => {
    db.all('SELECT * FROM categories', {}, (err, rows) => {
      res.json(rows);
    });
  });
});

app.post('/', (req, res) => {
  const id = '_' + Math.random().toString(36).slice(2);

  db.run(`INSERT INTO categories (ID, Name) VALUES (?, ?)`, [id, req.body.name]);

  res.json({ id, name: req.body.name });
});

app.delete('/:id', (req, res) => {
  db.run(`DELETE FROM categories WHERE ID = ?`, [req.params.id]);

  res.status(200).end();
});

app.listen(8080, () => console.log('Listening'));

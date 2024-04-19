const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./livros.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        num_paginas INTEGER,
        isbn TEXT,
        editora TEXT
    )`);
});

app.use(express.json());


app.use(cors());





app.get('/livros', (req, res) => {
    db.all('SELECT * FROM livros', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/livros/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM livros WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.post('/livros', (req, res) => {
    const { titulo, num_paginas, isbn, editora } = req.body;
    db.run('INSERT INTO livros (titulo, num_paginas, isbn, editora) VALUES (?, ?, ?, ?)', [titulo, num_paginas, isbn, editora], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.put('/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, num_paginas, isbn, editora } = req.body;
    db.run('UPDATE livros SET titulo = ?, num_paginas = ?, isbn = ?, editora = ? WHERE id = ?', [titulo, num_paginas, isbn, editora, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

app.delete('/livros/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM livros WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});

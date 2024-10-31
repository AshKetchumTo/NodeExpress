// database.js
const sqlite3 = require('sqlite3').verbose();

// Crea una nuova connessione al database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Errore nella connessione al database SQLite:', err.message);
  } else {
    console.log('Connesso al database SQLite');
  }
});

// Inizializza il database con una tabella di esempio
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titolo TEXT,
    contenuto TEXT,
    data_inserimento TEXT
  )`);
});

// Aggiunge alcuni post di default (OPZIONALE)
/*
db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO post (titolo, contenuto, data_inserimento) VALUES (?, ?, ?)`);
    stmt.run("Post 1", "Contenuto del primo post", new Date().toISOString());
    stmt.run("Post 2", "Contenuto del secondo post", new Date().toISOString());
    stmt.run("Post 3", "Contenuto del terzo post", new Date().toISOString());
    stmt.finalize();
  });
*/

module.exports = db;
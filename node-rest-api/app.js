const express = require('express');
const db = require('./database');

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

// Rotte di base
app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });

 // Rotte db

// [utenti] Aggiungi un nuovo utente
app.post('/utenti', (req, res) => {
    const { nome, email } = req.body;
    db.run(`INSERT INTO utenti (nome, email) VALUES (?, ?)`, [nome, email], function (err) {
      if (err) {
        res.status(500).json({ error: 'Errore nel creare utente' });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    });
  });
  
  // [utenti] Ottieni tutti gli utenti
  app.get('/utenti', (req, res) => {
    db.all(`SELECT * FROM utenti`, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Errore nel recuperare gli utenti' });
      } else {
        res.json(rows);
      }
    });
  });

  //  [utenti] Modifica un utente in base all'ID
app.patch('/utenti/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
  
    // Verifica che i campi obbligatori siano presenti
    if (!nome || !email) {
      return res.status(400).json({ error: 'I campi nome ed email sono obbligatori' });
    }
  
    // Esegui il comando SQL per aggiornare l'utente
    const sql = `UPDATE utenti SET nome = ?, email = ? WHERE id = ?`;
    const params = [nome, email, id];
  
    db.run(sql, params, function (err) {
      if (err) {
        res.status(500).json({ error: 'Errore nella modifica dell\'utente' });
      } else if (this.changes === 0) {
        // Se nessun record è stato aggiornato, l'utente non è stato trovato
        res.status(404).json({ error: 'Utente non trovato' });
      } else {
        res.json({ message: `Utente con ID ${id} modificato con successo` });
      }
    });
  });

  // [utenti] Elimina l'utente selezionato
  app.delete('/utenti/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM utenti WHERE id = ?`, id, function (err) {
      if (err) {
        res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
      } else if (this.changes === 0) {
        // Controlla se un record è stato effettivamente eliminato
        res.status(404).json({ error: 'Utente non trovato' });
      } else {
        res.json({ message: `Utente con ID ${id} eliminato con successo` });
      }
    });
  });

  // [post] Esempio di lista di post di un social
  app.get('/posts', (req, res) => {
    // Query per ottenere i post dal database, ordinati per data
    db.all(`SELECT * FROM post ORDER BY data_inserimento DESC`, [], (err, rows) => {
      if (err) {
        return res.status(500).send("Errore nel recuperare i post");
      }
  
      // Costruisci l'HTML con i dati dei post
      let html = '';
      rows.forEach(post => {
        html += '<div class="post-container">';
        html += `
          <div class="post-row">
            <h2>${post.titolo}</h2>
            <p>${post.contenuto}</p>
            <small>Data: ${new Date(post.data_inserimento).toLocaleString()}</small>
          </div>
        `;
        html += '</div>';
        });
    
      // Invia l'HTML come risposta
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    });
  });

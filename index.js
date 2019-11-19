const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/vaga', (req, res) => {
  res.render('vaga');
});

const port = 3000;
app.listen(port, err => {
  if (err) {
    console.log('Nao foi possivel rodar o servidor!');
  } else {
    console.log(`Servidor rodando na porta ${port}`);
  }
});

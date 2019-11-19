const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello FSL!');
});

const port = 3000;
app.listen(port, err => {
  if (err) {
    console.log('Nao foi possivel rodar o servidor!');
  } else {
    console.log(`Servidor rodando na porta ${port}`);
  }
});

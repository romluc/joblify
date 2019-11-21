const express = require('express');

const app = express();

const sqlite = require('sqlite');

const bodyParser = require('body-parser');

const dbConnection = sqlite.open('banco.sqlite', { Promise });

app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// GET routes
app.get('/', async (req, res) => {
  const db = await dbConnection;
  const categoriasDb = await db.all('select * from categorias');
  const vagas = await db.all('select * from vagas');
  const categorias = categoriasDb.map(cat => {
    return {
      ...cat,
      vagas: vagas.filter(vaga => vaga.categoria === cat.id),
    };
  });
  res.render('home', {
    categorias,
  });
});

app.get('/vaga/:id', async (req, res) => {
  const db = await dbConnection;
  const vaga = await db.get(`select * from vagas where id =${req.params.id}`);
  res.render('vaga', {
    vaga,
  });
});

app.get('/admin', (req, res) => {
  res.render('admin/home');
});

app.get('/admin/vagas', async (req, res) => {
  const db = await dbConnection;
  const vagas = await db.all('select * from vagas');
  res.render('admin/vagas', {
    vagas,
  });
});

app.get('/admin/vagas/delete/:id', async (req, res) => {
  const db = await dbConnection;
  await db.run(`delete from vagas where id = ${req.params.id}`);
  res.redirect('/admin/vagas');
});

app.get('/admin/vagas/nova', async (req, res) => {
  res.render('admin/nova-vaga');
});

// POST nova vaga route
app.post('/admin/vagas/nova', async (req, res) => {
  res.send(req.body);
});

const init = async () => {
  const db = await dbConnection;
  await db.run(
    'create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT)'
  );
  await db.run(
    'create table if not exists vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT)'
  );
};
init();

const port = 3000;
app.listen(port, err => {
  if (err) {
    console.log('Nao foi possivel rodar o servidor!');
  } else {
    console.log(`Servidor rodando na porta ${port}`);
  }
});

const express = require('express');

const app = express();

const sqlite = require('sqlite');

const dbConnection = sqlite.open('banco.sqlite', { Promise });

app.set('view engine', 'ejs');

app.use(express.static('public'));

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

const init = async () => {
  const db = await dbConnection;
  await db.run(
    'create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT)'
  );
  await db.run(
    'create table if not exists vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT)'
  );
  // const categoria = 'Marketing team';
  // await db.run(`insert into categorias(categoria) values('${categoria}')`);
  // const vaga = 'Social Media (Toronto)';
  // const descricao = 'Vaga para o Marketing FSL';
  // await db.run(
  //   `insert into vagas(categoria, titulo, descricao) values(3, '${vaga}', '${descricao}')`
  // );
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

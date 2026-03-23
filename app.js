const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

const initDb = require('./config/initDb');

const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuario');
const dashboardRoutes = require('./routes/dashboard');
const fornecedoresRoutes = require('./routes/fornecedores');
const produtosRoutes = require('./routes/produtos');
const notaFiscalRoutes = require('./routes/notaFiscal');
const comprasRoutes = require('./routes/compras');
const contatoRoutes = require('./routes/contato');
const historicoRoutes = require('./routes/historico');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(authRoutes);
app.use(usuarioRoutes);
app.use(dashboardRoutes);
app.use(fornecedoresRoutes);
app.use(produtosRoutes);
app.use(notaFiscalRoutes);
app.use(comprasRoutes);
app.use(contatoRoutes);
app.use(historicoRoutes);

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});

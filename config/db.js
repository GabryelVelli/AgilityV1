const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senha',  // sua senha do MySQL
  database: 'agility'
});

pool.getConnection()
  .then(conn => {
    console.log('Conectado ao MySQL');
    conn.release(); // libera a conexão
  })
  .catch(err => console.error('Falha na conexão com o banco de dados MySQL', err));

module.exports = pool;
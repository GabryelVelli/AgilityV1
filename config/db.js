const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
});

pool.getConnection()
  .then(conn => {
    console.log('Conectado ao MySQL');
    conn.release(); // libera a conexão
  })
  .catch(err => console.error('Falha na conexão com o banco de dados MySQL', err));

module.exports = pool;
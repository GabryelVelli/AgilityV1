const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MySQL com sucesso!');
    conn.release();
  })
  .catch(err => console.error('❌ Falha ao conectar no banco de dados:', err));

module.exports = pool;
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host:  process.env.DB_HOST, //'localhost',
    user:  process.env.DB_USER, //'root',
    password: process.env.DB_PASSWORD, //'senha',
    database:  process.env.DB_NAME,//'Agility',
    port: process.env.DB_PORT, //3306 
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MySQL com sucesso!');
    conn.release();
  })
  .catch(err => console.error('❌ Falha ao conectar no banco de dados:', err));

module.exports = pool;
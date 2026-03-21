const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host:  'localhost',
    user:  'root',
    password: 'senha',
    database:  'Agility',
    port: 3306 
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MySQL com sucesso!');
    conn.release();
  })
  .catch(err => console.error('❌ Falha ao conectar no banco de dados:', err));

module.exports = pool;
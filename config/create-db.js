const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createDatabase() {
  try {
    // Cria conexão SEM especificar database
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'senha',  // sua senha do MySQL
    });

    // Cria o banco de dados se não existir
    await connection.query('CREATE DATABASE IF NOT EXISTS agility');
    console.log('Banco de dados "agility" criado (ou já existia).');

    await connection.end();
  } catch (error) {
    console.error('Erro ao criar o banco de dados:', error);
  }
}

createDatabase();

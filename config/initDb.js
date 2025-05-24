const pool = require('./db'); // ajuste o caminho conforme seu projeto

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS USUARIO (
        IDusuario INT AUTO_INCREMENT PRIMARY KEY,
        nome NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        senha NVARCHAR(150) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ESTABELECIMENTO (
        IDestabelecimento INT AUTO_INCREMENT PRIMARY KEY,
        nome NVARCHAR(255) NOT NULL,
        CNPJ NVARCHAR(22) NOT NULL,
        contato NVARCHAR(225) NOT NULL,
        idusuario INT NOT NULL,
        FOREIGN KEY (idusuario) REFERENCES USUARIO(IDusuario)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Unidade (
        idunidade INT AUTO_INCREMENT PRIMARY KEY,
        IDestabelecimento INT,
        logradouro NVARCHAR(255) NOT NULL,
        numero INT NOT NULL,
        bairro NVARCHAR(255) NOT NULL,
        cidade NVARCHAR(255) NOT NULL,
        CEP NVARCHAR(255) NOT NULL,
        FOREIGN KEY (IDestabelecimento) REFERENCES ESTABELECIMENTO(IDestabelecimento)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Produto (
        idproduto INT AUTO_INCREMENT PRIMARY KEY,
        nome NVARCHAR(255) NOT NULL, 
        codigoBarras BIGINT NOT NULL, 
        vencimento DATE NOT NULL, 
        quantidade INT NOT NULL, 
        categoria NVARCHAR(50) NOT NULL, 
        fornecedor NVARCHAR(255) NOT NULL, 
        idusuario INT NOT NULL, 
        FOREIGN KEY (idusuario) REFERENCES USUARIO(IDusuario)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS COMPRAS (
        IDCompras INT AUTO_INCREMENT PRIMARY KEY,
        nome NVARCHAR(255) NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        quantidade INT NOT NULL,
        prioridade NVARCHAR(50) NOT NULL,
        categoria NVARCHAR(100) NOT NULL,
        idusuario INT NOT NULL, 
        FOREIGN KEY (idusuario) REFERENCES USUARIO(IDusuario)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS NOTA_FISCAL (
        IDnota INT AUTO_INCREMENT PRIMARY KEY,
        Numero VARCHAR(20) NOT NULL,
        Serie VARCHAR(10),
        data_emissao DATE NOT NULL,
        Valor_total DECIMAL(10,2) NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        Fornecedor NVARCHAR(255),
        idusuario INT NOT NULL, 
        FOREIGN KEY (idusuario) REFERENCES USUARIO(IDusuario)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS CONTATO (
        idcontato INT AUTO_INCREMENT PRIMARY KEY,
        nome NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        assunto NVARCHAR(90) NOT NULL, 
        Mensagem NVARCHAR(255) NOT NULL,
        idusuario INT NOT NULL, 
        FOREIGN KEY (idusuario) REFERENCES USUARIO(IDusuario)
      );
    `);

   await pool.query(`
      CREATE TABLE IF NOT EXISTS MovimentacaoEstoque (
        idmovimentacao INT AUTO_INCREMENT PRIMARY KEY,
        idproduto INT NOT NULL,
        idusuario INT NOT NULL,
        tipo ENUM('entrada', 'saida') NOT NULL,
        quantidade INT NOT NULL,
        dataMovimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT,
        FOREIGN KEY (idproduto) REFERENCES Produto(idproduto),
        FOREIGN KEY (idusuario) REFERENCES Usuario(idusuario)
      );
    `);


    console.log('Tabelas criadas ou já existentes.');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

module.exports = initDb;
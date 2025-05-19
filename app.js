const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('./config/db'); // Conexão com o banco de dados
const { detect } = require('detect-port');
const path = require('path');
dotenv.config();

const app = express();
const port = 3000
// const DEFAULT_PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'index.html'));
  });

// Middleware para processar dados do formulário (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).send('Token não fornecido.');

    const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Erro na verificação do token:', err.message);
            return res.status(500).send('Falha na autenticação do token.');
        }

        req.userId = decoded.id; // Certifique-se de que o id está correto
        next();
    });
};

//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
//CADASTRO E LOGIN //

app.post('/register', async (req, res) => {
    const { nome, cpf, email, senha } = req.body;

    try {
        const pool = await poolPromise;

        // Verificar se o email já está cadastrado
        const existingUser = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM USUARIO WHERE email = @email');

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Inserir novo usuário
        await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('cpf', sql.NVarChar, cpf)
            .input('email', sql.NVarChar, email)
            .input('senha', sql.NVarChar, hashedPassword)
            .query('INSERT INTO USUARIO (nome, cpf, email, senha) VALUES (@nome, @cpf, @email, @senha)');

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
});
// Rota de Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM USUARIO WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(400).json({ msg: 'Email ou senha inválidos.' });
        }

        const user = result.recordset[0];
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Email ou senha inválidos.' });
        }

        // Gera o token com o ID do usuário
        const token = jwt.sign({ id: user.IDusuario }, process.env.JWT_SECRET, { expiresIn: '30d' });
        console.log('Token gerado:', token); // Log para verificar o token

        return res.json({ token });
    } catch (error) {
        console.error('Erro no login:', error.message);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
});

// ROTA USUARIO //
// ROTA USUARIO //
// ROTA USUARIO //
// ROTA USUARIO //
// ROTA USUARIO //

app.get('/usuario/me', verifyToken, async (req, res) => {
  const idusuario = req.userId;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT nome FROM USUARIO WHERE IDusuario = @idusuario');

    if (result.recordset.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.json({ nome: result.recordset[0].nome });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message);
    res.status(500).send('Erro no servidor');
  }
});
// CONFIGURACOES // 
app.post('/usuario/alterar-senha', verifyToken, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const idusuario = req.userId;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).send('Campos senhaAtual e novaSenha são obrigatórios.');
  }

  try {
    const pool = await poolPromise;

    // Buscar hash da senha atual
    const result = await pool.request()
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT senha FROM USUARIO WHERE IDusuario = @idusuario');

    if (result.recordset.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const hashSenhaAtual = result.recordset[0].senha;

    // Comparar senha atual com hash
    const senhaConfere = await bcrypt.compare(senhaAtual, hashSenhaAtual);

    if (!senhaConfere) {
      return res.status(401).send('Senha atual incorreta');
    }

    // Criar hash da nova senha
    const saltRounds = 10;
    const hashNovaSenha = await bcrypt.hash(novaSenha, saltRounds);

    // Atualizar senha no banco
    await pool.request()
      .input('idusuario', sql.Int, idusuario)
      .input('novaSenha', sql.NVarChar(150), hashNovaSenha)
      .query('UPDATE USUARIO SET senha = @novaSenha WHERE IDusuario = @idusuario');

    res.send('Senha atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    res.status(500).send('Erro no servidor');
  }
});

// DASHBOARD HOME //
// DASHBOARD HOME //
// DASHBOARD HOME //
// DASHBOARD HOME //
// DASHBOARD HOME //

app.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const idusuario = req.userId;

        const totalProdutos = await pool.request()
            .input('idusuario', sql.Int, idusuario)
            .query('SELECT COUNT(*) AS total FROM Produto WHERE idusuario = @idusuario');

        const produtosVencidos = await pool.request()
            .input('idusuario', sql.Int, idusuario)
            .query('SELECT COUNT(*) AS total FROM Produto WHERE idusuario = @idusuario AND vencimento < GETDATE()');

        const proximosVencimento = await pool.request()
            .input('idusuario', sql.Int, idusuario)
            .query(`SELECT COUNT(*) AS total FROM Produto 
                    WHERE idusuario = @idusuario 
                    AND vencimento >= GETDATE() 
                    AND vencimento <= DATEADD(day, 7, GETDATE())`);

        const produtosSeguros = await pool.request()
            .input('idusuario', sql.Int, idusuario)
            .query(`SELECT COUNT(*) AS total FROM Produto 
                    WHERE idusuario = @idusuario 
                    AND vencimento > DATEADD(day, 7, GETDATE())`);

        res.json({
            totalProdutos: totalProdutos.recordset[0].total,
            produtosVencidos: produtosVencidos.recordset[0].total,
            proximosVencimento: proximosVencimento.recordset[0].total,
            produtosSeguros: produtosSeguros.recordset[0].total
        });
    } catch (error) {
        console.error('Erro ao buscar dados da dashboard:', error.message);
        res.status(500).send('Erro ao buscar dados da dashboard.');
    }
});

//ESTABELECIMENTO // 
//ESTABELECIMENTO // 
//ESTABELECIMENTO // 
//ESTABELECIMENTO // 
//ESTABELECIMENTO // 

app.post('/add-estabelecimento', verifyToken, async (req, res) => {
    const { nomeEstabelecimento, cnpj, contato, logradouro, numero, bairro, cidade, cep } = req.body;

    try {
        const pool = await poolPromise;
        const idusuario = req.userId; // Obtendo o ID do usuário do token

        console.log('ID do usuário:', idusuario); // Para depuração

        const estabelecimentoResult = await pool.request()
            .input('cnpj', sql.NVarChar, cnpj)
            .query('SELECT * FROM ESTABELECIMENTO WHERE CNPJ = @cnpj');

        if (estabelecimentoResult.recordset.length > 0) {
            return res.status(400).send('Estabelecimento com este CNPJ já cadastrada');
        }

        const estabelecimentoInsert = await pool.request()
            .input('nomeEstabelecimento', sql.NVarChar, nomeEstabelecimento)
            .input('cnpj', sql.NVarChar, cnpj)
            .input('contato', sql.NVarChar, contato)
            .input('idusuario', sql.Int, idusuario) // Aqui você está passando o ID do usuário
            .query('INSERT INTO Estabelecimento (nome, CNPJ, contato, idusuario) VALUES (@nomeEstabelecimento, @cnpj, @contato, @idusuario); SELECT SCOPE_IDENTITY() AS id');

        const idEstabelecimento = estabelecimentoInsert.recordset[0].id;

        await pool.request()
            .input('idEstabelecimento', sql.Int, idEstabelecimento)
            .input('logradouro', sql.NVarChar, logradouro)
            .input('numero', sql.NVarChar, numero)
            .input('bairro', sql.NVarChar, bairro)
            .input('cidade', sql.NVarChar, cidade)
            .input('cep', sql.NVarChar, cep)
            .query('INSERT INTO Unidade (idestabelecimento, logradouro, numero, bairro, cidade, cep) VALUES (@idEstabelecimento, @logradouro, @numero, @bairro, @cidade, @cep)');

        res.status(201).send('estabelecimento e unidade cadastradas com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar estabelecimento e unidade:', err.message);
        res.status(500).send('Erro ao cadastrar estabelecimento e unidade');
    }
});

app.get('/estabelecimentos', verifyToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const idusuario = req.userId;

    const result = await pool.request()
      .input('idusuario', sql.Int, idusuario)
      .query(`
        SELECT 
          e.IDestabelecimento,
          e.nome,
          e.CNPJ,
          e.contato,
          u.idunidade,
          u.logradouro,
          u.numero,
          u.bairro,
          u.cidade,
          u.cep
        FROM ESTABELECIMENTO e
        LEFT JOIN UNIDADE u ON e.IDestabelecimento = u.IDestabelecimento
        WHERE e.idusuario = @idusuario
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos com unidades:', error.message);
    res.status(500).send('Erro ao buscar estabelecimentos.');
  }
});

app.put('/estabelecimentos/:id', verifyToken, async (req, res) => {
  const { nomeEstabelecimento, cnpj, contato, logradouro, numero, bairro, cidade, cep } = req.body;
  const idEstabelecimento = req.params.id;

  try {
    const pool = await poolPromise;
    const idusuario = req.userId;

    // Verifica se o estabelecimento pertence ao usuário
    const check = await pool.request()
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = @idEstabelecimento AND idusuario = @idusuario');

    if (check.recordset.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    // Atualiza o estabelecimento
    await pool.request()
      .input('nomeEstabelecimento', sql.NVarChar, nomeEstabelecimento)
      .input('cnpj', sql.NVarChar, cnpj)
      .input('contato', sql.NVarChar, contato)
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .query(`UPDATE ESTABELECIMENTO 
              SET nome = @nomeEstabelecimento, CNPJ = @cnpj, contato = @contato 
              WHERE IDestabelecimento = @idEstabelecimento`);

    // Atualiza a unidade associada
    await pool.request()
      .input('logradouro', sql.NVarChar, logradouro)
      .input('numero', sql.NVarChar, numero)
      .input('bairro', sql.NVarChar, bairro)
      .input('cidade', sql.NVarChar, cidade)
      .input('cep', sql.NVarChar, cep)
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .query(`UPDATE UNIDADE 
              SET logradouro = @logradouro, numero = @numero, bairro = @bairro, cidade = @cidade, CEP = @cep
              WHERE IDestabelecimento = @idEstabelecimento`);

    res.send('Estabelecimento atualizado com sucesso.');
  } catch (err) {
    console.error('Erro ao atualizar estabelecimento:', err.message);
    res.status(500).send('Erro ao atualizar estabelecimento.');
  }
});
app.get('/estabelecimento-detalhes/:id', verifyToken, async (req, res) => {
  const idEstabelecimento = req.params.id;
  const idusuario = req.userId;

  try {
    const pool = await poolPromise;

    // Verifica se o estabelecimento pertence ao usuário
    const check = await pool.request()
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = @idEstabelecimento AND idusuario = @idusuario');

    if (check.recordset.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    const estabelecimento = check.recordset[0];

    // Busca os dados da unidade vinculada
    const unidadeResult = await pool.request()
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .query('SELECT * FROM UNIDADE WHERE IDestabelecimento = @idEstabelecimento');

    const unidade = unidadeResult.recordset[0] || {};

    res.json({
      estabelecimento,
      unidade
    });
  } catch (err) {
    console.error('Erro ao buscar detalhes do estabelecimento:', err.message);
    res.status(500).send('Erro ao buscar detalhes do estabelecimento.');
  }
});
app.get('/estabelecimentos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const idusuario = req.userId;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query(`
        SELECT 
          e.IDestabelecimento,
          e.nome,
          e.CNPJ,
          e.contato,
          u.idunidade,
          u.logradouro,
          u.numero,
          u.bairro,
          u.cidade,
          u.cep
        FROM ESTABELECIMENTO e
        LEFT JOIN UNIDADE u ON e.IDestabelecimento = u.IDestabelecimento
        WHERE e.idusuario = @idusuario
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send('Fornecedor não encontrado');
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error.message);
    res.status(500).send('Erro ao buscar fornecedor.');
  }
});
app.delete('/estabelecimentos/:id', verifyToken, async (req, res) => {
  const idEstabelecimento = req.params.id;
  const idusuario = req.userId;

  try {
    const pool = await poolPromise;

    // Verifica se pertence ao usuário
    const check = await pool.request()
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = @idEstabelecimento AND idusuario = @idusuario');

    if (check.recordset.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    // Exclui a unidade primeiro
    await pool.request()
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .query('DELETE FROM UNIDADE WHERE IDestabelecimento = @idEstabelecimento');

    // Depois exclui o estabelecimento
    await pool.request()
      .input('idEstabelecimento', sql.Int, idEstabelecimento)
      .query('DELETE FROM ESTABELECIMENTO WHERE IDestabelecimento = @idEstabelecimento');

    res.send('Estabelecimento excluído com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir estabelecimento:', err.message);
    res.status(500).send('Erro ao excluir estabelecimento.');
  }
});
// FIM ESTABELECIMENTO // 
// FIM ESTABELECIMENTO // 
// FIM ESTABELECIMENTO // 
// FIM ESTABELECIMENTO // 
// FIM ESTABELECIMENTO // 

// PRODUTOS //
// PRODUTOS //
// PRODUTOS //
// PRODUTOS //
// PRODUTOS //

app.post('/add-produto', verifyToken, async (req, res) => {
    const { nome, codigoBarras, vencimento, quantidade, fornecedor, categoria } = req.body;

    try {
        const pool = await poolPromise;
        const idusuario = req.userId; // Obtendo o ID do usuário do token

        console.log('ID do usuário:', idusuario); // Para depuração

        // Verificar se já existe um produto com o mesmo código de barras
        const produtoResult = await pool.request()
            .input('codigoBarras', sql.BigInt, codigoBarras)
            .query('SELECT * FROM Produto WHERE codigoBarras = @codigoBarras');

        if (produtoResult.recordset.length > 0) {
            return res.status(400).send('Produto com este código de barras já cadastrado');
        }

        // Inserir o produto na tabela Produto
        const produtoInsert = await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('codigoBarras', sql.BigInt, codigoBarras)
            .input('vencimento', sql.Date, vencimento)
            .input('quantidade', sql.Int, quantidade)
            .input('fornecedor', sql.NVarChar, fornecedor)
            .input('idusuario', sql.Int, idusuario) // ID do usuário autenticado
            .input('categoria', sql.VarChar, categoria)
            .query('INSERT INTO Produto (nome, codigoBarras, vencimento, quantidade, fornecedor,categoria, idusuario) VALUES (@nome, @codigoBarras, @vencimento, @quantidade, @fornecedor, @categoria, @idusuario); SELECT SCOPE_IDENTITY() AS id');

        res.status(201).send('Produto adicionado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err.message);
        res.status(500).send('Erro ao cadastrar produto');
    }
});

//REQUISICAO PARA "RESGATAR" OS PRODUTOS

app.get('/produtos', verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const idusuario = req.userId; // Obtém o ID do usuário a partir do token

        // Consulta para obter todos os produtos cadastrados pelo usuário
        const result = await pool.request()
            .input('idusuario', sql.Int, idusuario)
            .query('SELECT * FROM PRODUTO WHERE idusuario = @idusuario');

        // Retorna os dados dos produtos
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error.message);
        res.status(500).send('Erro ao buscar produtos.');
    }
});

// DELETE ID PRODUTO 
app.delete('/produtos/:idproduto', verifyToken, async (req, res) => {
    const { idproduto } = req.params;
    try {
        const pool = await poolPromise;
        const idusuario = req.userId; // Obtém o ID do usuário a partir do token

        // Consulta para deletar o produto
        await pool.request()
            .input('idproduto', sql.Int, idproduto)
            .input('idusuario', sql.Int, idusuario)
            .query('DELETE FROM Produto WHERE idproduto = @idproduto AND idusuario = @idusuario');

        res.status(200).send('Produto excluído com sucesso');
    } catch (error) {
        console.error('Erro ao excluir produto:', error.message);
        res.status(500).send('Erro ao excluir produto.');
    }
});
app.put('/produtos/:idproduto', verifyToken, async (req, res) => {
    const { idproduto } = req.params;
    const { nome, codigoBarras, vencimento, quantidade, fornecedor, categoria } = req.body;

    try {
        const pool = await poolPromise;
        const idusuario = req.userId;

        await pool.request()
            .input('idproduto', sql.Int, idproduto)
            .input('idusuario', sql.Int, idusuario)
            .input('nome', sql.NVarChar, nome)
            .input('codigoBarras', sql.BigInt, codigoBarras)
            .input('vencimento', sql.Date, vencimento)
            .input('quantidade', sql.Int, quantidade)
            .input('fornecedor', sql.NVarChar, fornecedor)
            .input('categoria', sql.VarChar, categoria)
            .query(`UPDATE Produto 
                    SET nome = @nome, codigoBarras = @codigoBarras, vencimento = @vencimento, 
                        quantidade = @quantidade, fornecedor = @fornecedor, categoria = @categoria 
                    WHERE idproduto = @idproduto AND idusuario = @idusuario`);

        res.status(200).send('Produto atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar produto:', error.message);
        res.status(500).send('Erro ao atualizar produto.');
    }
});
app.get('/produtos/:idproduto', verifyToken, async (req, res) => {
    const { idproduto } = req.params;

    try {
        const pool = await poolPromise;
        const idusuario = req.userId;

        const result = await pool.request()
            .input('idproduto', sql.Int, idproduto)
            .input('idusuario', sql.Int, idusuario)
            .query('SELECT * FROM Produto WHERE idproduto = @idproduto AND idusuario = @idusuario');

        if (result.recordset.length === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Erro ao buscar produto:', error.message);
        res.status(500).send('Erro ao buscar produto.');
    }
});
// FIM PRODUTOS //
// FIM PRODUTOS //
// FIM PRODUTOS //
// FIM PRODUTOS //
// FIM PRODUTOS //

// FUNCAO EMAIL //
// FUNCAO EMAIL //
// FUNCAO EMAIL //
// FUNCAO EMAIL //
// FUNCAO EMAIL //

app.post('/send-email', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body; // Dados do formulário

    // Verificar se os dados necessários foram enviados
    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }
// Rota para enviar código de redefinição
app.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // código de 6 dígitos

  try {
    await sql.connect(config);

    const result = await sql.query`UPDATE USUARIO SET token = ${token} WHERE email = ${email}`;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('E-mail não encontrado.');
    }

 const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.EMAIL_PASS   
        }
    });

    await transporter.sendMail({
      from: `"Agility" <${process.env.EMAIL_USER}>"`, 
      to: email,
      subject: 'Recuperação de Senha',
      text: `Seu código de verificação é: ${token}`
    });

    res.send('Código enviado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno no servidor.');
  }
});
// Rota para redefinir senha
app.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um novo código de 6 dígitos

  try {
    await sql.connect(config);

    const result = await sql.query`
      UPDATE USUARIO 
      SET token = ${token} 
      WHERE email = ${email}
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('E-mail não encontrado.');
    }

    // Enviar o código atualizado por e-mail
    await transporter.sendMail({
      from: `"Agility" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Seu código de verificação é: ${token}`
    });

    res.send('Novo código enviado! Confira seu e-mail.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno no servidor.');
  }
});
document.getElementById("recuperarSenhaForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value; // Pega o e-mail digitado

    const response = await fetch("http://localhost:3000/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const result = await response.text();
    alert(result); // Exibe "Novo código enviado! Confira seu e-mail."
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


    
    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Seu e-mail
            pass: process.env.EMAIL_PASS   // Senha gerada do app
        }
    });

    const mailOptions = {
        from: email,  // E-mail do remetente
        to: 'agilityv1contato@gmail.com',  // Destinatário do e-mail
        subject: assunto,
        text: `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto}\nMensagem: ${mensagem}`
    };

    // Envio do e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail:', error);
            return res.status(500).send('Erro ao enviar e-mail. Tente novamente mais tarde.');
        }

        console.log('E-mail enviado:', info.response);
        res.status(200).send('E-mail enviado com sucesso!');
    });
});
// FIM FUNCAO EMAIL //
// FIM FUNCAO EMAIL //
// FIM FUNCAO EMAIL //
// FIM FUNCAO EMAIL //
// FIM FUNCAO EMAIL //

// NOTA FISCAL //
// NOTA FISCAL //
// NOTA FISCAL //
// NOTA FISCAL //
// NOTA FISCAL //
app.post('/nota/adicionar', verifyToken, async (req, res) => {
  const { Numero, Serie, data_emissao, Valor_total, Fornecedor } = req.body;

  try {
    const pool = await poolPromise;
    const idusuario = req.userId; // do token JWT

    console.log('ID do usuário (nota):', idusuario); // para debug

    // Inserir a nota fiscal
    await pool.request()
      .input('Numero', sql.VarChar(20), Numero)
      .input('Serie', sql.VarChar(10), Serie)
      .input('data_emissao', sql.Date, data_emissao)
      .input('Valor_total', sql.Decimal(10, 2), Valor_total)
      .input('Fornecedor', sql.NVarChar(255), Fornecedor)
      .input('idusuario', sql.Int, idusuario)
      .query(`
        INSERT INTO NOTA_FISCAL 
        (Numero, Serie, data_emissao, Valor_total, Fornecedor, idusuario)
        VALUES 
        (@Numero, @Serie, @data_emissao, @Valor_total, @Fornecedor, @idusuario)
      `);

    res.status(201).send('Nota fiscal adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar nota fiscal:', err.message);
    res.status(500).send('Erro ao adicionar nota fiscal');
  }
});

app.get('/nota/listar', verifyToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const idusuario = req.userId;

    const result = await pool.request()
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM NOTA_FISCAL WHERE idusuario = @idusuario ORDER BY criado_em DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar notas fiscais:', err.message);
    res.status(500).send('Erro ao buscar notas fiscais');
  }
});

app.get('/nota/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM NOTA_FISCAL WHERE IDnota = @id AND idusuario = @idusuario');

    if (result.recordset.length === 0) {
      return res.status(404).send('Nota não encontrada');
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao buscar nota:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

app.put('/nota/editar/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;

  console.log('REQ.BODY:', req.body); // <== debug

  const { Numero, Serie, data_emissao, Valor_total, Fornecedor } = req.body;

  try {
    const pool = await poolPromise;

    const existe = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM NOTA_FISCAL WHERE IDnota = @id AND idusuario = @idusuario');

    if (existe.recordset.length === 0) {
      return res.status(404).send('Nota não encontrada ou acesso negado');
    }

    await pool.request()
      .input('Numero', sql.VarChar, Numero)
      .input('Serie', sql.VarChar, Serie)
      .input('data_emissao', sql.Date, data_emissao)
      .input('Valor_total', sql.Decimal(10, 2), Valor_total)
      .input('Fornecedor', sql.NVarChar, Fornecedor)
      .input('id', sql.Int, id)
      .query(`UPDATE NOTA_FISCAL 
              SET Numero = @Numero, Serie = @Serie, data_emissao = @data_emissao, 
                  Valor_total = @Valor_total, Fornecedor = @Fornecedor 
              WHERE IDnota = @id`);

    res.send('Nota fiscal atualizada com sucesso');
  } catch (err) {
    console.error('Erro ao editar nota:', err.message);
    res.status(500).send('Erro ao editar nota fiscal');
  }
});

app.delete('/nota/excluir/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const idusuario = req.userId;

    const pool = await poolPromise;

    // Verifica se a nota pertence ao usuário
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM NOTA_FISCAL WHERE IDnota = @id AND idusuario = @idusuario');

    if (result.recordset.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta nota.');
    }

    // Exclui a nota
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM NOTA_FISCAL WHERE IDnota = @id');

    res.status(200).send('Nota excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir nota fiscal:', err.message);
    res.status(500).send('Erro ao excluir nota fiscal');
  }
});

// FIM NOTA FISCAL //
// FIM NOTA FISCAL //
// FIM NOTA FISCAL //
// FIM NOTA FISCAL //
// FIM NOTA FISCAL //

// COMPRAS //
// COMPRAS //
// COMPRAS //
// COMPRAS //
// COMPRAS //
app.post('/compras/adicionar', verifyToken, async (req, res) => {
  const { nome, valor, quantidade, prioridade, categoria } = req.body;

  try {
    const pool = await poolPromise;
    const idusuario = req.userId;

    await pool.request()
      .input('nome', sql.NVarChar(255), nome)
      .input('valor', sql.Decimal(10, 2), valor)
      .input('quantidade', sql.Int, quantidade)
      .input('prioridade', sql.NVarChar(50), prioridade)
      .input('categoria', sql.NVarChar(100), categoria)
      .input('idusuario', sql.Int, idusuario)
      .query(`
        INSERT INTO COMPRAS (nome, valor, quantidade, prioridade, categoria, idusuario)
        VALUES (@nome, @valor, @quantidade, @prioridade, @categoria, @idusuario)
      `);

    res.status(201).send('Compra adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar compra:', err.message);
    res.status(500).send('Erro ao adicionar compra');
  }
});

// LISTAR COMPRAS
app.get('/compras/listar', verifyToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const idusuario = req.userId;

    const result = await pool.request()
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM COMPRAS WHERE idusuario = @idusuario ORDER BY idcompra DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao buscar compras:', err.message);
    res.status(500).send('Erro ao buscar compras');
  }
});

// BUSCAR COMPRA POR ID
app.get('/compras/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM COMPRAS WHERE idcompra = @id AND idusuario = @idusuario');

    if (result.recordset.length === 0) {
      return res.status(404).send('Compra não encontrada');
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao buscar compra:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// EDITAR COMPRA
app.put('/compras/editar/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;
  const { nome, valor, quantidade, prioridade, categoria } = req.body;

  try {
    const pool = await poolPromise;

    const existe = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM COMPRAS WHERE idcompra = @id AND idusuario = @idusuario');

    if (existe.recordset.length === 0) {
      return res.status(404).send('Compra não encontrada ou acesso negado');
    }

    await pool.request()
      .input('nome', sql.NVarChar(255), nome)
      .input('valor', sql.Decimal(10, 2), valor)
      .input('quantidade', sql.Int, quantidade)
      .input('prioridade', sql.NVarChar(50), prioridade)
      .input('categoria', sql.NVarChar(100), categoria)
      .input('id', sql.Int, id)
      .query(`
        UPDATE COMPRAS 
        SET nome = @nome, valor = @valor, quantidade = @quantidade, 
            prioridade = @prioridade, categoria = @categoria 
        WHERE idcompra = @id
      `);

    res.send('Compra atualizada com sucesso');
  } catch (err) {
    console.error('Erro ao editar compra:', err.message);
    res.status(500).send('Erro ao editar compra');
  }
});

// EXCLUIR COMPRA
app.delete('/compras/excluir/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const idusuario = req.userId;

    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idusuario', sql.Int, idusuario)
      .query('SELECT * FROM COMPRAS WHERE idcompra = @id AND idusuario = @idusuario');

    if (result.recordset.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta compra.');
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM COMPRAS WHERE idcompra = @id');

    res.status(200).send('Compra excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir compra:', err.message);
    res.status(500).send('Erro ao excluir compra');
  }
});


// FIM COMPRAS //
// FIM COMPRAS //
// FIM COMPRAS //
// FIM COMPRAS //
// FIM COMPRAS //

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
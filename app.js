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
//rota cadastro
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

// FUNCAO CD_HOME FUNCAO CD_HOME FUNCAO CD_HOME FUNCAO CD_HOME FUNCAO CD_HOME //

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

// FUNCAO CD_ESTABELECIMENTO FUNCAO CD_ESTABELECIMENTO FUNCAO CD_ESTABELECIMENTO FUNCAO CD_ESTABELECIMENTO //
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
        const idusuario = req.userId; // Obtém o ID do usuário a partir do token

        // Consulta para obter todas as estabelecimento cadastradas pelo usuário
        const result = await pool.request()
            .input('idusuario', sql.Int, idusuario)
            .query('SELECT * FROM estabelecimento WHERE idusuario = @idusuario');

        // Retorna os dados para o frontend
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar estabelecimento:', error.message);
        res.status(500).send('Erro ao buscar estabelecimento.');
    }
});

// FUNCAO PRODUTO FUNCAO PRODUTO FUNCAO PRODUTO FUNCAO PRODUTO //

//ADICIONAR PRODUTO
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

app.post('/send-email', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body; // Dados do formulário

    // Verificar se os dados necessários foram enviados
    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

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

// add compra 
app.post('/add-compra', verifyToken, async (req, res) => {
    const { nome, valor, quantidade, prioridade, categoria } = req.body;

    try {
        const pool = await poolPromise;
        const idusuario = req.userId; // ID do usuário vindo do token

        console.log('ID do usuário:', idusuario); // Para depuração

        // Inserção da compra no banco
        await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('valor', sql.Decimal(10, 2), valor)
            .input('quantidade', sql.Int, quantidade)
            .input('prioridade', sql.NVarChar, prioridade)
            .input('categoria', sql.NVarChar, categoria)
            .input('idusuario', sql.Int, idusuario)
            .query(`
                INSERT INTO COMPRAS (nome, valor, quantidade, prioridade, categoria, idusuario)
                VALUES (@nome, @valor, @quantidade, @prioridade, @categoria, @idusuario)
            `);

        res.status(201).send('Compra cadastrada com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar compra:', err.message);
        res.status(500).send('Erro ao cadastrar compra');
    }
});
//itens cadastrados


// Rota para deletar uma compra
app.delete('/compras/:id', (req, res) => {
    const id = req.params.id;
  
    // Aqui você executa a lógica de deletar do banco
    const query = 'DELETE FROM compras WHERE idcompra = ?';
    
    conexao.query(query, [id], (err, result) => {
      if (err) {
        console.error('Erro ao excluir compra:', err);
        return res.status(500).send('Erro ao excluir compra');
      }
  
      res.status(200).send('Compra excluída com sucesso');
    });
  });

// Iniciar o servidor
// detect(DEFAULT_PORT).then((port) => {
//     app.listen(port, () => {
//         console.log(`Servidor rodando em http://localhost:${port}`);
//     });
// }).catch(err => {
//     console.error('Erro ao detectar porta:', err);
// });
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
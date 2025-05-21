const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });


const initDb = require('./config/initDb');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
    req.userId = decoded.id;
    next();
  });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view', 'index.html'));
});

//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
//CADASTRO E LOGIN //
const pool = require('./config/db');

app.post('/register', async (req, res) => {
  const { nome, cpf, email, senha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO USUARIO (nome, cpf, email, senha) VALUES (?, ?, ?, ?)', 
      [nome, cpf, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'Email ou senha inválidos.' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.IDusuario }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.json({ token });
  } catch (error) {
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
    const [rows] = await pool.query('SELECT nome FROM USUARIO WHERE IDusuario = ?', [idusuario]);

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.json({ nome: rows[0].nome });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message);
    res.status(500).send('Erro no servidor');
  }
});
// CONFIGURACOES // 
// CONFIGURACOES // 
// CONFIGURACOES // 
// CONFIGURACOES // 
// CONFIGURACOES // 
app.post('/usuario/alterar-senha', verifyToken, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const idusuario = req.userId;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).send('Campos senhaAtual e novaSenha são obrigatórios.');
  }

  try {
    const [rows] = await pool.query(
      'SELECT senha FROM USUARIO WHERE IDusuario = ?', 
      [idusuario]
    );

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const hashSenhaAtual = rows[0].senha;

    const senhaConfere = await bcrypt.compare(senhaAtual, hashSenhaAtual);
    if (!senhaConfere) {
      return res.status(401).send('Senha atual incorreta');
    }

    const hashNovaSenha = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      'UPDATE USUARIO SET senha = ? WHERE IDusuario = ?', 
      [hashNovaSenha, idusuario]
    );

    res.send('Senha atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    res.status(500).send('Erro no servidor');
  }
});
app.post('/usuario/alterar-email', verifyToken, async (req, res) => {
  const { emailAtual, novoEmail } = req.body;
  const idusuario = req.userId;

  if (!emailAtual || !novoEmail) {
    return res.status(400).send('Campos emailAtual e novoEmail são obrigatórios.');
  }

  try {
    // Busca o e-mail atual no banco
    const [rows] = await pool.query(
      'SELECT email FROM USUARIO WHERE IDusuario = ?',
      [idusuario]
    );

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const emailSalvo = rows[0].email;

    // Verifica se o e-mail atual informado confere
    if (emailAtual !== emailSalvo) {
      return res.status(401).send('E-mail atual incorreto');
    }

    // Atualiza o e-mail no banco
    await pool.query(
      'UPDATE USUARIO SET email = ? WHERE IDusuario = ?',
      [novoEmail, idusuario]
    );

    res.send('E-mail atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar e-mail:', err);
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
    const idusuario = req.userId;

    // Total de produtos
    const [totalProdutos] = await pool.query(
      'SELECT COUNT(*) AS total FROM Produto WHERE idusuario = ?', 
      [idusuario]
    );

    // Produtos vencidos
    const [produtosVencidos] = await pool.query(
      'SELECT COUNT(*) AS total FROM Produto WHERE idusuario = ? AND vencimento < CURDATE()', 
      [idusuario]
    );

    // Produtos com vencimento nos próximos 7 dias
    const [proximosVencimento] = await pool.query(
      `SELECT COUNT(*) AS total FROM Produto 
       WHERE idusuario = ? 
       AND vencimento >= CURDATE() 
       AND vencimento <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)`, 
      [idusuario]
    );

    // Produtos com vencimento depois de 7 dias
    const [produtosSeguros] = await pool.query(
      `SELECT COUNT(*) AS total FROM Produto 
       WHERE idusuario = ? 
       AND vencimento > DATE_ADD(CURDATE(), INTERVAL 7 DAY)`, 
      [idusuario]
    );

    res.json({
      totalProdutos: totalProdutos[0].total,
      produtosVencidos: produtosVencidos[0].total,
      proximosVencimento: proximosVencimento[0].total,
      produtosSeguros: produtosSeguros[0].total
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
  const {
    nomeEstabelecimento,
    cnpj,
    contato,
    logradouro,
    numero,
    bairro,
    cidade,
    cep
  } = req.body;

  try {
    const idusuario = req.userId;

    // Verifica se já existe CNPJ
    const [estabelecimentoResult] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE CNPJ = ?',
      [cnpj]
    );

    if (estabelecimentoResult.length > 0) {
      return res.status(400).send('Estabelecimento com este CNPJ já cadastrado');
    }

    // Inserir estabelecimento
    const [estabelecimentoInsert] = await pool.query(
      'INSERT INTO ESTABELECIMENTO (nome, CNPJ, contato, idusuario) VALUES (?, ?, ?, ?)',
      [nomeEstabelecimento, cnpj, contato, idusuario]
    );

    const idEstabelecimento = estabelecimentoInsert.insertId;

    // Inserir unidade relacionada
    await pool.query(
      'INSERT INTO Unidade (idestabelecimento, logradouro, numero, bairro, cidade, cep) VALUES (?, ?, ?, ?, ?, ?)',
      [idEstabelecimento, logradouro, numero, bairro, cidade, cep]
    );

    res.status(201).send('Estabelecimento e unidade cadastrados com sucesso');
  } catch (err) {
    console.error('Erro ao cadastrar estabelecimento e unidade:', err.message);
    res.status(500).send('Erro ao cadastrar estabelecimento e unidade');
  }
});
app.get('/estabelecimentos', verifyToken, async (req, res) => {
  try {
    const idusuario = req.userId;

    const [rows] = await pool.query(`
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
      LEFT JOIN Unidade u ON e.IDestabelecimento = u.IDestabelecimento
      WHERE e.idusuario = ?
    `, [idusuario]);

    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos com unidades:', error.message);
    res.status(500).send('Erro ao buscar estabelecimentos.');
  }
});
app.put('/estabelecimentos/:id', verifyToken, async (req, res) => {
  const { nomeEstabelecimento, cnpj, contato, logradouro, numero, bairro, cidade, cep } = req.body;
  const idEstabelecimento = req.params.id;

  try {
    const idusuario = req.userId;

    // Verifica se o estabelecimento pertence ao usuário
    const [check] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = ? AND idusuario = ?',
      [idEstabelecimento, idusuario]
    );

    if (check.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    // Atualiza o estabelecimento
    await pool.query(
      `UPDATE ESTABELECIMENTO 
       SET nome = ?, CNPJ = ?, contato = ? 
       WHERE IDestabelecimento = ?`,
      [nomeEstabelecimento, cnpj, contato, idEstabelecimento]
    );

    // Atualiza a unidade associada
    await pool.query(
      `UPDATE Unidade 
       SET logradouro = ?, numero = ?, bairro = ?, cidade = ?, CEP = ?
       WHERE IDestabelecimento = ?`,
      [logradouro, numero, bairro, cidade, cep, idEstabelecimento]
    );

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
    // Verifica se o estabelecimento pertence ao usuário
    const [check] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = ? AND idusuario = ?',
      [idEstabelecimento, idusuario]
    );

    if (check.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    const estabelecimento = check[0];

    // Busca os dados da unidade vinculada
    const [unidadeResult] = await pool.query(
      'SELECT * FROM Unidade WHERE IDestabelecimento = ?',
      [idEstabelecimento]
    );

    const unidade = unidadeResult[0] || {};

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
    const [result] = await pool.query(`
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
      LEFT JOIN Unidade u ON e.IDestabelecimento = u.IDestabelecimento
      WHERE e.idusuario = ? AND e.IDestabelecimento = ?
    `, [idusuario, id]);

    if (result.length === 0) {
      return res.status(404).send('Estabelecimento não encontrado');
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error.message);
    res.status(500).send('Erro ao buscar estabelecimento.');
  }
});
app.delete('/estabelecimentos/:id', verifyToken, async (req, res) => {
  const idEstabelecimento = req.params.id;
  const idusuario = req.userId;

  try {
    // Verifica se o estabelecimento pertence ao usuário
    const [check] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = ? AND idusuario = ?',
      [idEstabelecimento, idusuario]
    );

    if (check.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    // Exclui a(s) unidade(s) primeiro
    await pool.query(
      'DELETE FROM Unidade WHERE IDestabelecimento = ?',
      [idEstabelecimento]
    );

    // Depois exclui o estabelecimento
    await pool.query(
      'DELETE FROM ESTABELECIMENTO WHERE IDestabelecimento = ?',
      [idEstabelecimento]
    );

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
        const idusuario = req.userId;
        console.log('ID do usuário:', idusuario); // Para depuração

        // Verificar se já existe um produto com o mesmo código de barras
        const [produtoResult] = await pool.query(
            'SELECT * FROM Produto WHERE codigoBarras = ?',
            [codigoBarras]
        );

        if (produtoResult.length > 0) {
            return res.status(400).send('Produto com este código de barras já cadastrado');
        }

        // Inserir o produto
        await pool.query(
            `INSERT INTO Produto 
                (nome, codigoBarras, vencimento, quantidade, fornecedor, categoria, idusuario) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nome, codigoBarras, vencimento, quantidade, fornecedor, categoria, idusuario]
        );

        res.status(201).send('Produto adicionado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err.message);
        res.status(500).send('Erro ao cadastrar produto');
    }
});
app.get('/produtos', verifyToken, async (req, res) => {
  try {
    const idusuario = req.userId;

    const [rows] = await pool.query(
      'SELECT * FROM Produto WHERE idusuario = ?',
      [idusuario]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).send('Erro ao buscar produtos.');
  }
});
app.delete('/produtos/:idproduto', verifyToken, async (req, res) => {
    const { idproduto } = req.params;
    try {
        const idusuario = req.userId; // Obtém o ID do usuário a partir do token

        // Consulta para deletar o produto
        const [result] = await pool.query(
            'DELETE FROM Produto WHERE idproduto = ? AND idusuario = ?',
            [idproduto, idusuario]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado ou sem permissão para excluir');
        }

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
        const idusuario = req.userId;

        const [result] = await pool.query(
            `UPDATE Produto
             SET nome = ?, codigoBarras = ?, vencimento = ?, quantidade = ?, fornecedor = ?, categoria = ?
             WHERE idproduto = ? AND idusuario = ?`,
            [nome, codigoBarras, vencimento, quantidade, fornecedor, categoria, idproduto, idusuario]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado ou sem permissão para atualizar');
        }

        res.status(200).send('Produto atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar produto:', error.message);
        res.status(500).send('Erro ao atualizar produto.');
    }
});
app.get('/produtos/:idproduto', verifyToken, async (req, res) => {
    const { idproduto } = req.params;

    try {
        const idusuario = req.userId;

        const [rows] = await pool.query(
            'SELECT * FROM Produto WHERE idproduto = ? AND idusuario = ?',
            [idproduto, idusuario]
        );

        if (rows.length === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar produto:', error.message);
        res.status(500).send('Erro ao buscar produto.');
    }
});
// NOTA FISCAL //
// NOTA FISCAL //
// NOTA FISCAL //
// NOTA FISCAL //
// NOTA FISCAL //

app.post('/nota/adicionar', verifyToken, async (req, res) => {
  const { Numero, Serie, data_emissao, Valor_total, Fornecedor } = req.body;

  try {
    const idusuario = req.userId; // ID do usuário do token JWT

    // Insere a nota fiscal no MySQL
    await pool.query(
      `INSERT INTO NOTA_FISCAL 
       (Numero, Serie, data_emissao, Valor_total, Fornecedor, idusuario) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Numero, Serie, data_emissao, Valor_total, Fornecedor, idusuario]
    );

    res.status(201).send('Nota fiscal adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar nota fiscal:', err.message);
    res.status(500).send('Erro ao adicionar nota fiscal');
  }
});
app.get('/nota/listar', verifyToken, async (req, res) => {
  try {
    const idusuario = req.userId;

    const [notas] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE idusuario = ? ORDER BY criado_em DESC',
      [idusuario]
    );

    res.json(notas);
  } catch (err) {
    console.error('Erro ao listar notas fiscais:', err.message);
    res.status(500).send('Erro ao buscar notas fiscais');
  }
});
app.get('/nota/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, idusuario]
    );

    if (rows.length === 0) {
      return res.status(404).send('Nota não encontrada');
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar nota:', err.message);
    res.status(500).send('Erro no servidor');
  }
});
app.put('/nota/editar/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;

  const { Numero, Serie, data_emissao, Valor_total, Fornecedor } = req.body;

  try {
    // Verifica se a nota existe e pertence ao usuário
    const [existe] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, idusuario]
    );

    if (existe.length === 0) {
      return res.status(404).send('Nota não encontrada ou acesso negado');
    }

    // Atualiza a nota fiscal
    await pool.query(
      `UPDATE NOTA_FISCAL 
       SET Numero = ?, Serie = ?, data_emissao = ?, 
           Valor_total = ?, Fornecedor = ?
       WHERE IDnota = ? AND idusuario = ?`,
      [Numero, Serie, data_emissao, Valor_total, Fornecedor, id, idusuario]
    );

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

    // Verifica se a nota pertence ao usuário
    const [result] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, idusuario]
    );

    if (result.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta nota.');
    }

    // Exclui a nota
    await pool.query(
      'DELETE FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, idusuario]
    );

    res.status(200).send('Nota excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir nota fiscal:', err.message);
    res.status(500).send('Erro ao excluir nota fiscal');
  }
});
// COMPRAS //
// COMPRAS //
// COMPRAS //
// COMPRAS //
// COMPRAS //
app.post('/compras/adicionar', verifyToken, async (req, res) => {
  const { nome, valor, quantidade, prioridade, categoria } = req.body;

  try {
    const idusuario = req.userId;

    await pool.query(
      `INSERT INTO COMPRAS (nome, valor, quantidade, prioridade, categoria, idusuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, valor, quantidade, prioridade, categoria, idusuario]
    );

    res.status(201).send('Compra adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar compra:', err.message);
    res.status(500).send('Erro ao adicionar compra');
  }
});
app.get('/compras/listar', verifyToken, async (req, res) => {
  try {
    const idusuario = req.userId;
    const [rows] = await pool.query('SELECT * FROM COMPRAS WHERE idusuario = ? ORDER BY IDCompras DESC', [idusuario]);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar compras:', err);
    res.status(500).send('Erro ao buscar compras');
  }
});
app.get('/compras/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;

  try {
    // Usa pool.query direto, sem poolPromise.request()
    const [rows] = await pool.query(
      'SELECT * FROM COMPRAS WHERE IDCompras = ? AND idusuario = ?',
      [id, idusuario]
    );

    if (rows.length === 0) {
      return res.status(404).send('Compra não encontrada');
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar compra:', err.message);
    res.status(500).send('Erro no servidor');
  }
});
app.put('/compras/editar/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const idusuario = req.userId;
  const { nome, valor, quantidade, prioridade, categoria } = req.body;

  try {
    const [existe] = await pool.query(
      'SELECT * FROM COMPRAS WHERE IDCompras = ? AND idusuario = ?',
      [id, idusuario]
    );

    if (existe.length === 0) {
      return res.status(404).send('Compra não encontrada ou acesso negado');
    }

    await pool.query(
      `UPDATE COMPRAS
       SET nome = ?, valor = ?, quantidade = ?, prioridade = ?, categoria = ?
       WHERE IDCompras = ? AND idusuario = ?`,
      [nome, valor, quantidade, prioridade, categoria, id, idusuario]
    );

    res.send('Compra atualizada com sucesso');
  } catch (err) {
    console.error('Erro ao editar compra:', err.message);
    res.status(500).send('Erro ao editar compra');
  }
});

app.delete('/compras/excluir/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const idusuario = req.userId;

    // Verifica se a compra pertence ao usuário
    const [result] = await pool.query(
      'SELECT * FROM COMPRAS WHERE IDCompras = ? AND idusuario = ?',
      [id, idusuario]
    );

    if (result.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta compra.');
    }

    // Exclui a compra
    await pool.query(
      'DELETE FROM COMPRAS WHERE IDCompras = ?',
      [id]
    );

    res.status(200).send('Compra excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir compra:', err.message);
    res.status(500).send('Erro ao excluir compra');
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
//RECUPERAR SENHA 
app.post('/verificar-email', async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'E-mail não encontrado' });
    }
    res.json({ message: 'E-mail encontrado, prossiga para redefinir a senha' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao consultar o banco' });
  }
});
// Rota para redefinir a senha (passo 2)
app.post('/redefinir-senha', async (req, res) => {
  const { email, novaSenha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado com esse e-mail' });
    }

    const hashSenha = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE USUARIO SET senha = ? WHERE email = ?', [hashSenha, email]);

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar a senha' });
  }
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}).catch(err => {
  console.error('Erro ao inicializar banco:', err);
  process.exit(1);
});
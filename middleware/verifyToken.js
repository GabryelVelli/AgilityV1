const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send('Token não fornecido.');
  }

  const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do token:', err.message);
      return res.status(500).send('Falha na autenticação do token.');
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;

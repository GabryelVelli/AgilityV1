const nodemailer = require('nodemailer');

async function sendEmail(req, res) {
  const { nome, email, assunto, mensagem } = req.body;

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).send('Todos os campos sao obrigatorios.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    replyTo: email,
    to: 'gabryel.velli@gmail.com',
    subject: assunto,
    text: `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto}\nMensagem: ${mensagem}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).send('E-mail enviado com sucesso!');
  } catch (error) {
    console.log('Erro ao enviar e-mail:', error);
    return res.status(500).send('Erro ao enviar e-mail. Tente novamente mais tarde.');
  }
}

module.exports = { sendEmail };

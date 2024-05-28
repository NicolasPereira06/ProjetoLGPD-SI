import express from 'express';
import bcrypt from 'bcrypt';
import DB from '../ConnectDB/db';

function SignUp(): express.Router {
  const router = express.Router();

  // Middleware para parsing de JSON
  router.use(express.json());

  router.post('/SignUp', async (req, res) => {
    try {
      const {
        user_first_name,
        user_last_name,
        user_cpf,
        user_date_birth,
        user_cellphone,
        user_address,
        user_email,
        user_password
      } = req.body;

      // Verifica se o CPF já está cadastrado
      const cpfCheck = await DB.query('SELECT * FROM Users WHERE user_cpf = $1', [user_cpf]);
      if (cpfCheck.rows.length > 0) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }

      const emailCheck = await DB.query('SELECT * FROM Users WHERE user_email = $1', [user_email]);
      if (emailCheck.rows.length > 0) {
        return res.status(401).json({error: 'Email já cadastrado'})
      }

      const hashedPassword = await bcrypt.hash(user_password, 10);

      const result = await DB.query(
        'INSERT INTO Users (user_first_name, user_last_name, user_cpf, user_date_birth, user_cellphone, user_address, user_email, user_password) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8) RETURNING user_id',
        [user_first_name, user_last_name, user_cpf, user_date_birth, user_cellphone, JSON.stringify(user_address), user_email, hashedPassword]
      );

      res.status(200).json({ message: 'Usuário criado com sucesso', user_id: result.rows[0].user_id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default SignUp;

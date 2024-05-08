import express from 'express';
import bcrypt from 'bcrypt';
import DB from '../ConnectDB/db';

function SignUp(): express.Router {
  const router = express.Router();

  router.post('/SignUp', async (req, res) => {
    try {
      const {
        user_first_name,
        user_last_name,
        user_cpf,
        user_date_birth,
        user_address,
        user_email,
        user_password
      } = req.body;

      const hashedPassword = await bcrypt.hash(user_password, 10);

      await DB.query(
        'INSERT INTO Users (user_first_name, user_last_name, user_cpf, user_date_birth, user_address, user_email, user_password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user_first_name, user_last_name, user_cpf, user_date_birth, user_address, user_email, hashedPassword]
      );

      res.status(200).json({ message: 'Usuário criado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default SignUp;
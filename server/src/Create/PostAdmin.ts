import express from 'express';
import bcrypt from 'bcrypt';
import { DB } from '../ConnectDB/db';

function SignUpAdmin(): express.Router {
  const router = express.Router();

  router.post('/SignUpAdmin', async (req, res) => {
    try {
      const {
        user_email,
        user_password
      } = req.body;

      const emailCheck = await DB.query('SELECT * FROM Admin WHERE admin_email = $1', [user_email]);
      if (emailCheck.rows.length > 0) {
        return res.status(401).json({error: 'Email já cadastrado'})
      }

      const hashedPassword = await bcrypt.hash(user_password, 10);

      await DB.query(
        'INSERT INTO Admin (admin_email, admin_password) VALUES ($1, $2)',
        [user_email, hashedPassword]
      );

      res.status(200).json({ message: 'Admin criado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default SignUpAdmin;
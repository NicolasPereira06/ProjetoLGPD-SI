import express from 'express';
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { DB, DBKey } from '../ConnectDB/db'; // Importe ambas as instâncias dos bancos de dados

function decryptData(data: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const Login = (): express.Router => {
  const router = express.Router();

  router.post('/Login', async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
      // Recupera os usuários e as chaves do banco de dados
      const usersResult = await DB.query('SELECT * FROM Users');
      const keysResult = await DBKey.query('SELECT * FROM Keys');

      // Verifica se é um administrador
      const adminResult = await DB.query('SELECT * FROM Admin WHERE admin_email = $1', [user_email]);
      const admin = adminResult.rows[0];

      if (admin) {
        const passwordMatch = await bcrypt.compare(user_password, admin.admin_password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        return res.status(200).json({ message: 'Login bem-sucedido', userId: admin.admin_id, userType: 'admin' });
      }

      // Verifica entre os usuários
      const user = usersResult.rows.find(user => {
        const userKeyObj = keysResult.rows.find(key => key.user_id === user.user_id);
        if (!userKeyObj) return false; // Verifica se a chave foi encontrada
        const userKey = userKeyObj.key_name;
        const decryptedEmail = decryptData(user.user_email, userKey);
        return decryptedEmail === user_email;
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const passwordMatch = await bcrypt.compare(user_password, user.user_password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      res.status(200).json({ message: 'Login bem-sucedido', userId: user.user_id, userType: 'user' });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  return router;
}

export default Login;

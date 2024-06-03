import express from 'express';
import CryptoJS from 'crypto-js';
import { DB, DBKey } from '../ConnectDB/db';

function decryptData(data: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function ReadUserID(): express.Router {
  const router = express.Router();

  router.get('/User/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;

      // Primeiro, obter a chave secreta associada ao usuário do banco de dados DB2
      const secretKeyResult = await DBKey.query('SELECT key_name FROM Keys WHERE user_id = $1', [user_id]);
      if (secretKeyResult.rows.length === 0) {
        return res.status(404).json({ message: 'Chave secreta do usuário não encontrada' });
      }

      const SECRET_KEY = secretKeyResult.rows[0].key_name;

      const result = await DB.query('SELECT * FROM Users WHERE user_id = $1', [user_id]);

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Usuário não encontrado' });
      } else {
        const user = result.rows[0];
        
        // Descriptografar os dados sensíveis usando a chave secreta do usuário
        try {
          user.user_first_name = decryptData(user.user_first_name, SECRET_KEY);
          user.user_last_name = decryptData(user.user_last_name, SECRET_KEY);
          user.user_cpf = decryptData(user.user_cpf, SECRET_KEY);
          user.user_date_birth = decryptData(user.user_date_birth, SECRET_KEY);
          user.user_cellphone = decryptData(user.user_cellphone, SECRET_KEY);
          const decryptedAddress = decryptData(user.user_address, SECRET_KEY);
          user.user_address = decryptedAddress ? JSON.parse(decryptedAddress) : null;
          user.user_email = decryptData(user.user_email, SECRET_KEY);
        } catch (error) {
          return res.status(500).json({ error: 'Erro ao descriptografar os dados do usuário' });
        }

        res.status(200).json(user);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

function ReadUsers(): express.Router {
  const router = express.Router();

  router.get('/Users', async (req, res) => {
    try {
      const usersResult = await DB.query('SELECT * FROM Users');
      const keysResult = await DBKey.query('SELECT * FROM Keys');
      
      const users = usersResult.rows.map(user => {
        try {
          const userKey = keysResult.rows.find(key => key.user_id === user.user_id).key_name;
          
          user.user_first_name = decryptData(user.user_first_name, userKey);
          user.user_last_name = decryptData(user.user_last_name, userKey);
          user.user_cpf = decryptData(user.user_cpf, userKey);
          user.user_date_birth = decryptData(user.user_date_birth, userKey);
          user.user_cellphone = decryptData(user.user_cellphone, userKey);
          const decryptedAddress = decryptData(user.user_address, userKey);
          user.user_address = decryptedAddress ? JSON.parse(decryptedAddress) : null;
          user.user_email = decryptData(user.user_email, userKey);

          return user;
        } catch (error) {
          // Se houver erro na descriptografia de um usuário, continuar para o próximo
          return null;
        }
      }).filter(user => user !== null);

      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

export { ReadUserID, ReadUsers };

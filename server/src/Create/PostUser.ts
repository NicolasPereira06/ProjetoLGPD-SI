import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { DB, DBKey } from '../ConnectDB/db'; // Importe ambas as instâncias dos bancos de dados

function generateSecretKey(): string {
  return crypto.randomUUID().toString();
}

function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(data: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const SignUp = (): express.Router => {
  const router = express.Router();

  // Middleware para parsing de JSON
  router.use(express.json());

  router.post('/SignUp', async (req, res) => {
    try {
      const SECRET_KEY = generateSecretKey(); // Gera uma chave secreta única

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

      // Recupera todas as chaves e dados do banco para verificação
      const keysResult = await DBKey.query('SELECT * FROM Keys');
      const usersResult = await DB.query('SELECT * FROM Users');

      const isCPFUsed = usersResult.rows.some(user => {
        const userKeyObj = keysResult.rows.find(key => key.user_id === user.user_id);
        if (!userKeyObj) return false; // Verifica se a chave foi encontrada
        const userKey = userKeyObj.key_name;
        const decryptedCPF = decryptData(user.user_cpf, userKey);
        return decryptedCPF === user_cpf;
      });

      if (isCPFUsed) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }

      const isEmailUsed = usersResult.rows.some(user => {
        const userKeyObj = keysResult.rows.find(key => key.user_id === user.user_id);
        if (!userKeyObj) return false; // Verifica se a chave foi encontrada
        const userKey = userKeyObj.key_name;
        const decryptedEmail = decryptData(user.user_email, userKey);
        return decryptedEmail === user_email;
      });

      if (isEmailUsed) {
        return res.status(401).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(user_password, 10);

      // Criptografa os dados sensíveis
      const encryptedFirstName = encryptData(String(user_first_name), SECRET_KEY);
      const encryptedLastName = encryptData(String(user_last_name), SECRET_KEY);
      const encryptedCPF = encryptData(String(user_cpf), SECRET_KEY);
      const encryptedDateOfBirth = encryptData(String(user_date_birth), SECRET_KEY);
      const encryptedCellphone = encryptData(String(user_cellphone), SECRET_KEY);
      const encryptedAddress = encryptData(JSON.stringify(user_address), SECRET_KEY);
      const encryptedEmail = encryptData(String(user_email), SECRET_KEY);

      const result = await DB.query(
        'INSERT INTO Users (user_first_name, user_last_name, user_cpf, user_date_birth, user_cellphone, user_address, user_email, user_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
        [encryptedFirstName, encryptedLastName, encryptedCPF, encryptedDateOfBirth, encryptedCellphone, encryptedAddress, encryptedEmail, hashedPassword]
      );

      // Insere a chave secreta e o ID do usuário no novo banco de dados
      await DBKey.query(
        'INSERT INTO Keys (user_id, key_name) VALUES ($1, $2)',
        [result.rows[0].user_id, SECRET_KEY]
      );

      res.status(200).json({ message: 'Usuário criado com sucesso', user_id: result.rows[0].user_id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default SignUp;

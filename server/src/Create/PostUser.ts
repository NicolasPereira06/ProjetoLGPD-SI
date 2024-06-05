import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { DB, DBKey } from '../ConnectDB/db'; // Importe ambas as instâncias dos bancos de dados
import createDecryptedUsersView from '../ConnectDB/decrypted';

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

      const cpfCheck = await DB.query('SELECT * FROM DecryptedUsers WHERE user_cpf = $1', [user_cpf]);
      if (cpfCheck.rows.length > 0) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }

      const emailCheck = await DB.query('SELECT * FROM DecryptedUsers WHERE user_email = $1', [user_email]);
      if (emailCheck.rows.length > 0) {
        return res.status(401).json({error: 'Email já cadastrado'})
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

      createDecryptedUsersView()
      
      res.status(200).json({ message: 'Usuário criado com sucesso', user_id: result.rows[0].user_id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default SignUp;

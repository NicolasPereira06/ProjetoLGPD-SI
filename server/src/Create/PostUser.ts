import express from 'express';
import bcrypt from 'bcrypt';
import DB from '../ConnectDB/db';
import CryptoJS from 'crypto-js';

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

      // Chave de criptografia (mantenha em segredo e não a armazene no código)
      const chaveCriptografia = 'fatec11';

      // Criptografar dados sensíveis
      const firstNameCriptografado = CryptoJS.AES.encrypt(user_first_name, chaveCriptografia).toString();
      const lastNameCriptografado = CryptoJS.AES.encrypt(user_last_name, chaveCriptografia).toString();
      const cpfCriptografado = CryptoJS.AES.encrypt(user_cpf, chaveCriptografia).toString();
      const dateOfBirthCriptografado = CryptoJS.AES.encrypt(user_date_birth, chaveCriptografia).toString();
      const addressCriptografado = CryptoJS.AES.encrypt(JSON.stringify(user_address), chaveCriptografia).toString();
      const emailCriptografado = CryptoJS.AES.encrypt(user_email, chaveCriptografia).toString();
      const hashedPassword = await bcrypt.hash(user_password, 10);

      await DB.query(
        'INSERT INTO Users (user_first_name, user_last_name, user_cpf, user_date_birth, user_address, user_email, user_password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [firstNameCriptografado, lastNameCriptografado, cpfCriptografado, dateOfBirthCriptografado, addressCriptografado, emailCriptografado, hashedPassword]
      );

      res.status(200).json({ message: 'Usuário criado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default SignUp;
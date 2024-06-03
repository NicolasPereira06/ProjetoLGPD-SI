import express from 'express';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { DB, DBKey } from '../ConnectDB/db'; // Importe ambas as instâncias dos bancos de dados

function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function EditUser(): express.Router {
  const router = express.Router();

  router.put('/EditUser/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const {
        user_first_name,
        user_last_name,
        user_cpf,
        user_cellphone,
        user_email,
        user_address
      } = req.body;

      // Recupera a chave secreta do banco de dados DBKey
      const keyResult = await DBKey.query('SELECT key_name FROM Keys WHERE user_id = $1', [user_id]);
      if (keyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Chave secreta não encontrada para este usuário' });
      }
      const SECRET_KEY = keyResult.rows[0].key_name;

      // Criptografa os dados sensíveis
      const updatedFields: { [key: string]: any } = {};
      if (user_first_name !== undefined) updatedFields.user_first_name = encryptData(user_first_name, SECRET_KEY);
      if (user_last_name !== undefined) updatedFields.user_last_name = encryptData(user_last_name, SECRET_KEY);
      if (user_cpf !== undefined) updatedFields.user_cpf = encryptData(user_cpf, SECRET_KEY);
      if (user_cellphone !== undefined) updatedFields.user_cellphone = encryptData(user_cellphone, SECRET_KEY);
      if (user_email !== undefined) updatedFields.user_email = encryptData(user_email, SECRET_KEY);
      if (user_address !== undefined) updatedFields.user_address = encryptData(JSON.stringify(user_address), SECRET_KEY);

      const fields = Object.keys(updatedFields);
      const values = Object.values(updatedFields);
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

      const queryText = `UPDATE Users SET ${setClause} WHERE user_id = $1 RETURNING ${fields.join(', ')}`;
      const result = await DB.query(queryText, [user_id, ...values]);

      const updatedUser = result.rows[0];

      res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        updatedFields: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

export default EditUser;

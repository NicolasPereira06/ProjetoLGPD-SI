import express from 'express';
import CryptoJS from 'crypto-js';
import { DB, DBKey } from '../ConnectDB/db'; // Importe ambas as instâncias dos bancos de dados

function decryptData(data: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const createDecryptedUsersView = async () => {
  try {
    const keysResult = await DBKey.query('SELECT * FROM Keys');
    const usersResult = await DB.query('SELECT * FROM Users');

    const viewQueries = usersResult.rows.map(user => {
      const userKey = keysResult.rows.find(key => key.user_id === user.user_id)?.key_name;

      if (!userKey) {
        return null; // Ignora o usuário se a chave não for encontrada
      }

      const decryptedFirstName = decryptData(user.user_first_name, userKey);
      const decryptedLastName = decryptData(user.user_last_name, userKey);
      const decryptedCPF = decryptData(user.user_cpf, userKey);
      const decryptedDateOfBirth = decryptData(user.user_date_birth, userKey);
      const decryptedCellphone = decryptData(user.user_cellphone, userKey);
      const decryptedAddress = decryptData(user.user_address, userKey);
      const decryptedEmail = decryptData(user.user_email, userKey);
      const hashedPassword = user.user_password;

      return `
        SELECT
          '${user.user_id}' AS user_id,
          '${decryptedFirstName}' AS user_first_name,
          '${decryptedLastName}' AS user_last_name,
          '${decryptedCPF}' AS user_cpf,
          '${decryptedDateOfBirth}' AS user_date_birth,
          '${decryptedCellphone}' AS user_cellphone,
          '${decryptedAddress}'::jsonb AS user_address,
          '${decryptedEmail}' AS user_email,
          '${hashedPassword}' AS user_password
      `;
    }).filter(query => query !== null);

    const viewQuery = viewQueries.join(' UNION ALL ');

    // Remove a view DecryptedUsers, se existir
    await DB.query('DROP VIEW IF EXISTS DecryptedUsers');

    // Cria a view DecryptedUsers novamente com o campo user_address como jsonb
    await DB.query(`
      CREATE VIEW DecryptedUsers AS
      ${viewQuery || 'SELECT NULL AS user_id, NULL AS user_first_name, NULL AS user_last_name, NULL AS user_cpf, NULL AS user_date_birth, NULL AS user_cellphone, NULL AS user_address, NULL AS user_email, NULL AS user_password WHERE 1 = 0'}
    `);
    
    console.log('Conectado ao Banco e servidor rodando.');
  } catch (error: any) {
    console.log('Erro ao sincronizar', error.message);
  }
};

export default createDecryptedUsersView;

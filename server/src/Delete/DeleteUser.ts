import express from 'express';
import { DB, DBKey } from '../ConnectDB/db'; // Importe ambas as instâncias dos bancos de dados
import createDecryptedUsersView from '../ConnectDB/decrypted';

function DeleteUserKey(): express.Router {
  const router = express.Router();

  router.delete('/RemoveUser/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
      // Exclui a chave de criptografia associada ao usuário
      const keyResult = await DBKey.query('DELETE FROM Keys WHERE user_id = $1', [user_id]);

      if (keyResult.rowCount === 0) {
        return res.status(404).json({ message: 'Chave de criptografia não encontrada para exclusão' });
      }

      createDecryptedUsersView()

      res.status(200).json({ message: 'Cadastro excluído com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

export default DeleteUserKey;

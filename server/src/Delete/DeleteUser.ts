import express from 'express';
import DB from '../ConnectDB/db';

function DeleteUser(): express.Router {
    const router = express.Router();

    router.delete('/RemoveUser/:user_id', async (req, res) => {
        const { user_id } = req.params;

        try {
            const result = await DB.query('DELETE FROM Users WHERE user_id = $1', [user_id]);

            if (result.rowCount === 0) {
                res.status(404).json({ message: 'Usuário não encontrado para exclusão' });
            } else {
                res.status(200).json({ message: 'Usuário excluído com sucesso' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default DeleteUser;
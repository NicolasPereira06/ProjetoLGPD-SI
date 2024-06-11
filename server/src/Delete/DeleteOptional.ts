import express from 'express';
import { DB } from '../ConnectDB/db';

function DeleteOptional(): express.Router {
    const router = express.Router();

    router.delete('/DeleteOptional/:optional_id', async (req, res) => {
        const { optional_id } = req.params;
        
        try {
            const result = await DB.query('DELETE FROM optional WHERE optional_id = $1', [optional_id]);
    
            if (result.rowCount === 0) {
                res.status(404).json({ message: 'Opcional não encontrado para exclusão' });
            } else {
                res.status(200).json({ message: 'Opcional excluído com sucesso' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default DeleteOptional;

import express from 'express';
import { DB } from '../ConnectDB/db';

function DeleteTerms(): express.Router {
    const router = express.Router();

    router.delete('/DeleteTerms/:term_id', async (req, res) => {
        const { term_id } = req.params;
        
        try {
            const result = await DB.query('DELETE FROM term WHERE term_id = $1', [term_id]);
    
            if (result.rowCount === 0) {
                res.status(404).json({ message: 'Termo não encontrado para exclusão' });
            } else {
                res.status(200).json({ message: 'Termo excluído com sucesso' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default DeleteTerms;

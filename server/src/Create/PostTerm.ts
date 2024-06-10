import express from 'express';
import { DB } from '../ConnectDB/db';

function AddTerm() {
    const router = express.Router();

    router.post('/AddTerm', async (req, res) => {
        const { term_title, term_content } = req.body;

        if (!term_title || !term_content) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios não foram fornecidos.' });
        }

        try {
            const result = await DB.query(
                'INSERT INTO term (term_title, term_content) VALUES ($1, $2) RETURNING term_id',
                [term_title, term_content]
            );

            res.status(200).json({ success: true, term_id: result.rows[0].term_id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Erro ao salvar o termo' });
        }
    });

    return router;
}

export default AddTerm;

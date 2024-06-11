import express from 'express';
import { DB } from '../ConnectDB/db';

function PostOptional() {
    const router = express.Router();

    router.post('/PostOptional/:term_id', async (req, res) => {
        const { term_id } = req.params;
        const { optional_title, optional_content } = req.body;

        if (!optional_title || !optional_content || !term_id) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios não foram fornecidos.' });
        }

        try {
            const result = await DB.query(
                'INSERT INTO optional (optional_title, optional_content, term_id) VALUES ($1, $2, $3) RETURNING optional_id',
                [optional_title, optional_content, term_id]
            );

            res.status(200).json({ success: true, optional_id: result.rows[0].optional_id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Erro ao salvar o opcional' });
        }
    });

    return router;
}

export default PostOptional;

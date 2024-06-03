import express from 'express';
import { DB } from '../ConnectDB/db';

function AddTerm() {
    const router = express.Router();

    router.post('/AddTerm', async (req, res) => {
        const { terms_title, terms_content, terms_mandatory } = req.body;

        if (!terms_title || !terms_content) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios não foram fornecidos.' });
        }

        try {
            const result = await DB.query(
                'INSERT INTO Terms (terms_title, terms_content, terms_mandatory) VALUES ($1, $2, $3) RETURNING terms_id',
                [terms_title, terms_content, terms_mandatory]
            );

            res.status(200).json({ success: true, terms_id: result.rows[0].terms_id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Erro ao salvar o termo' });
        }
    });

    return router;
}

export default AddTerm;

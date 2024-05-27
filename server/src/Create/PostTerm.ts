import express from 'express';
import DB from '../ConnectDB/db';

function AddTerm() {
    const router = express.Router();

    router.post('/AddTerm', async (req, res) => {
        const { terms_title, terms_content } = req.body;

        if (!terms_title || !terms_content) {
            return res.status(400).send('Campos obrigatórios não foram fornecidos.');
        }

        try {
            const result = await DB.query(
                'INSERT INTO Terms (terms_title, terms_content) VALUES ($1, $2) RETURNING terms_id',
                [terms_title, terms_content]
            );

            res.status(200).json({ terms_id: result.rows[0].terms_id });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao salvar o termo');
        }
    });

    return router;
}

export default AddTerm;

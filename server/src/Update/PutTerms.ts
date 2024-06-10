import express from 'express';
import { DB } from '../ConnectDB/db';

function PutTerms(): express.Router {
    const router = express.Router();

    router.put('/PutTerms/:term_id', async (req, res) => {
        try {
            const { term_id } = req.params;
            const {
                term_title,
                term_content
            } = req.body;

            const updatedFields: { [key: string]: any } = {};
            if (term_title !== undefined) updatedFields.term_title = term_title;
            if (term_content !== undefined) updatedFields.term_content = term_content;

            const fields = Object.keys(updatedFields);
            const values = Object.values(updatedFields);
            const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

            const queryText = `UPDATE term SET ${setClause} WHERE term_id = $1 RETURNING ${fields.join(', ')}`;
            const result = await DB.query(queryText, [term_id, ...values]);

            const updatedTerm = result.rows[0];

            res.status(200).json({
                success: true,
                message: 'Termo atualizado com sucesso',
                updatedFields: updatedTerm,
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(500).json({ success: false, error: errorMessage });
        }
    });

    return router;
}

export default PutTerms;

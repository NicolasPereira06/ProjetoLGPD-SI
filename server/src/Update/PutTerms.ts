import express from 'express';
import DB from '../ConnectDB/db';

function PutTerms(): express.Router {
    const router = express.Router();

    router.put('/PutTerms/:terms_id', async (req, res) => {
        try {
            const { terms_id } = req.params;
            const {
                terms_title,
                terms_content,
                terms_mandatory,
            } = req.body;

            const updatedFields: { [key: string]: any } = {};
            if (terms_title !== undefined) updatedFields.terms_title = terms_title;
            if (terms_content !== undefined) updatedFields.terms_content = terms_content;
            if (terms_mandatory !== undefined) updatedFields.terms_mandatory = terms_mandatory;

            const fields = Object.keys(updatedFields);
            const values = Object.values(updatedFields);
            const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

            const queryText = `UPDATE Terms SET ${setClause} WHERE terms_id = $1 RETURNING ${fields.join(', ')}`;
            const result = await DB.query(queryText, [terms_id, ...values]);

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

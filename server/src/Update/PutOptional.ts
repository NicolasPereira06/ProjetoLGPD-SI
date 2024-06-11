import express from 'express';
import { DB } from '../ConnectDB/db';

function PutOptional(): express.Router {
    const router = express.Router();

    router.put('/PutOptional/:optional_id', async (req, res) => {
        try {
            const { optional_id } = req.params;
            const {
                optional_title,
                optional_content
            } = req.body;

            const updatedFields: { [key: string]: any } = {};
            if (optional_title !== undefined) updatedFields.optional_title = optional_title;
            if (optional_content !== undefined) updatedFields.optional_content = optional_content;

            const fields = Object.keys(updatedFields);
            const values = Object.values(updatedFields);
            const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

            const queryText = `UPDATE optional SET ${setClause} WHERE optional_id = $1 RETURNING ${fields.join(', ')}`;
            const result = await DB.query(queryText, [optional_id, ...values]);

            const updatedOptional = result.rows[0];

            res.status(200).json({
                success: true,
                message: 'Opcional atualizado com sucesso',
                updatedFields: updatedOptional,
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(500).json({ success: false, error: errorMessage });
        }
    });

    return router;
}

export default PutOptional;

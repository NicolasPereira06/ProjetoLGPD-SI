import express from 'express';
import { DB } from '../ConnectDB/db';

function PutUserOptional(): express.Router {
    const router = express.Router();

    router.put('/PutUserOptional', async (req, res) => {
        try {
            const optionalArray = req.body;
            console.log(optionalArray)

            for (const optional of optionalArray) {
                const { user_optional_id, accepted } = optional;
                await DB.query(`UPDATE user_optional SET accepted = $1 WHERE user_optional_id = $2`, [accepted, user_optional_id]);
              }

            res.status(200).json({
                success: true,
                message: 'Opcional atualizado com sucesso',
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(500).json({ success: false, error: errorMessage });
        }
    });

    return router;
}

export default PutUserOptional;

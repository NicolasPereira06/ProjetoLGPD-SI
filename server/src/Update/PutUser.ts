import express from 'express';
import DB from '../ConnectDB/db';

function EditUser(): express.Router {
    const router = express.Router();

    router.put('/EditUser/:user_id', async (req, res) => {
        try {
            const { user_id } = req.params;
            const {
                user_email,
                user_date_birth,
                user_address
            } = req.body;

            const updatedFields: { [key: string]: any } = {};
            if (user_email !== undefined) updatedFields.user_email = user_email;
            if (user_date_birth !== undefined) updatedFields.user_date_birth = user_date_birth;
            if (user_address !== undefined) updatedFields.user_address = user_address;

            const fields = Object.keys(updatedFields);
            const values = Object.values(updatedFields);
            const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

            const queryText = `UPDATE Users SET ${setClause} WHERE user_id = $1 RETURNING ${fields.join(', ')}`;
            const result = await DB.query(queryText, [user_id, ...values]);

            const updatedUser = result.rows[0];

            res.status(200).json({
                message: 'Usuário atualizado com sucesso',
                updatedFields: updatedUser,
            });
            
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default EditUser;
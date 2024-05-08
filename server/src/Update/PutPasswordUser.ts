import express from 'express';
import bcrypt from 'bcrypt';
import DB from '../ConnectDB/db';

function UpdatePassword(): express.Router {
    const router = express.Router();

    router.put('/UpdatePassword/:user_id', async (req, res) => {
        try {
            const { user_id } = req.params;
            const { user_senha, user_senha_atual } = req.body;            

            let passwordFieldName = "user_password";
            let currentPassword;

            const user = await DB.query(`SELECT ${passwordFieldName} FROM Users WHERE user_id = $1`, [user_id]);
            currentPassword = user.rows[0][passwordFieldName];

            const passwordMatch = await bcrypt.compare(user_senha_atual, currentPassword);
            const passwordMatch2 = await bcrypt.compare(user_senha, currentPassword);

            if (!passwordMatch) {
                return res.status(406).json({ message: 'Senha atual incorreta' });
            } else if (passwordMatch2) {
                return res.status(406).json({ message: 'A senha nova não pode ser igual a anterior.' });
            } else {

                const hashedPassword = await bcrypt.hash(user_senha, 10);

                await DB.query(`UPDATE Users SET ${passwordFieldName} = $1 WHERE user_id = $2`, [hashedPassword, user_id]);

                res.status(200).json({ message: 'Senha atualizada com sucesso' });
            }
        } catch (error: any) {
            console.error('Erro ao atualizar senha:', error.message);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    });

    return router;
}

export default UpdatePassword;
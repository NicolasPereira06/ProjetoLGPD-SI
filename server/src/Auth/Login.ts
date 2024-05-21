import express from 'express';
import bcrypt from 'bcrypt';
import DB from '../ConnectDB/db';

function Login(): express.Router {
    const router = express.Router();

    router.post('/Login', async (req, res) => {
        const { user_email, user_password } = req.body;

        try {
            const userResult = await DB.query('SELECT * FROM Users WHERE user_email = $1', [user_email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const passwordMatch = await bcrypt.compare(user_password, user.user_password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const userId = user.user_id;
            const userType = user.user_type || 'user';
            res.status(200).json({ message: 'Login bem-sucedido', userId, userType });
        } catch (error: any) {
            console.error('Erro ao fazer login:', error.message);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    });

    return router;
}

export default Login;

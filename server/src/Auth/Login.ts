import express from 'express';
import bcrypt from 'bcrypt';
import DB from '../ConnectDB/db';

function Login(): express.Router {
    const router = express.Router();

    router.post('/Login', async (req, res) => {
        const { user_email, user_password } = req.body;

        try {
            const userResult = await DB.query('SELECT * FROM users WHERE user_email = $1', [user_email]);
            const user = userResult.rows[0];

            const adminResult = await DB.query('SELECT * FROM admin WHERE admin_email = $1', [user_email]);
            const admin = adminResult.rows[0];

            let userId;
            let userType;

            if (user) {
                userId = user.user_id;
                userType = 'user';
            } else if (admin) {
                userId = admin.admin_id;
                userType = 'admin';
            } else {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            const passwordMatch = await bcrypt.compare(user_password, user ? user.user_password : admin ? admin.admin_password : '');

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            res.status(200).json({ message: 'Login bem-sucedido', userId, userType });
        } catch (error: any) {
            console.error('Erro ao fazer login:', error.message);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    });

    return router;
}

export default Login;
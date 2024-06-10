import express from 'express';
import { DB } from '../ConnectDB/db';

function PostUserOptional(): express.Router {
  const router = express.Router();

  // Middleware para parsing de JSON
  router.use(express.json());

  router.post('/PostUserOptional', async (req, res) => {
    const termsArray = req.body;

    try {
      for (const term of termsArray) {
        const { user_id, optional_id, accepted } = term;
        await DB.query(
            'INSERT INTO user_optional (user_id, optional_id, accepted) VALUES ($1, $2, $3) ',
            [user_id, optional_id, accepted]
        );
      }
      res.status(200).json({ message: 'Opcional vinculado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default PostUserOptional;

import express from 'express';
import { DB } from '../ConnectDB/db';

function PostUserTerms(): express.Router {
  const router = express.Router();

  // Middleware para parsing de JSON
  router.use(express.json());

  router.post('/PostUserTerms', async (req, res) => {
    const termsArray = req.body;

    try {
      for (const term of termsArray) {
        const { user_id, terms_id, accepted } = term;
        await DB.query(
            'INSERT INTO UserTerms (user_id, terms_id, accepted) VALUES ($1, $2, $3) ',
            [user_id, terms_id, accepted]
        );
      }
      res.status(200).json({ message: 'Termo vinculado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default PostUserTerms;

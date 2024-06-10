import express from 'express';
import { DB } from '../ConnectDB/db';

function GetUserTerms(): express.Router {

  const router = express.Router();

  router.get('/GetUserTerms/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;

      const result = await DB.query(`
        SELECT ut.user_term_id, ut.term_id, ut.accepted, t.term_title, t.term_content 
        FROM user_term ut 
        JOIN term t ON ut.term_id = t.term_id 
        WHERE ut.user_id = $1;`, [user_id]);

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Termo não encontrado' });
      } else {
        res.status(200).json(result.rows);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;

};

export { GetUserTerms };
import express from 'express';
import { DB } from '../ConnectDB/db';

function GetUserTerms(): express.Router {

  const router = express.Router();

  router.get('/GetUserTerms/:user_id', async (req, res) => {
      try {
        const { user_id } = req.params;
    
        const result = await DB.query('SELECT * FROM userterms WHERE user_id = $1', [user_id]);
    
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Usuário não encontrado' });
        } else {
          res.status(200).json(result.rows[0]);
        }
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
  });

  return router;

};


export default GetUserTerms;
import express from 'express';
import { DB } from '../ConnectDB/db';

function GetUserOptional(): express.Router {

  const router = express.Router();

  router.get('/GetUserOptional/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;

      const result = await DB.query(`
        SELECT uo.user_optional_id, uo.optional_id, uo.accepted, o.optional_title, o.optional_content 
        FROM user_optional uo 
        JOIN optional o ON uo.optional_id = o.optional_id 
        WHERE uo.user_id = $1;`, [user_id]);

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Opcional não encontrado' });
      } else {
        res.status(200).json(result.rows);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;

};

export { GetUserOptional };
import express from 'express';
import { DB } from '../ConnectDB/db';

function GetOptional(): express.Router {

  const router = express.Router();

  router.get('/GetOptional', async (req, res) => {
    
    try {
        const result = await DB.query('SELECT * FROM optional;');
        
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).send('Opcional não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
  });

  return router;

};

export {GetOptional};
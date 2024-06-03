import express from 'express';
import { DB } from '../ConnectDB/db';


function GetTerms(): express.Router {

  const router = express.Router();

  router.get('/GetTerms', async (_, res) => {
      try {
        const result = await DB.query('SELECT * FROM terms;');
    
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Sem termos registrados' });
        } else {
          res.status(200).json(result.rows);
        }
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
  });

  return router;

};

function GetTermsId(): express.Router {

  const router = express.Router();

  router.get('/GetTermsId/:terms_id', async (req, res) => {
    const terms_id = req.params.terms_id;
    
    try {
        const result = await DB.query('SELECT * FROM terms WHERE terms_id = $1', [terms_id]);
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Termo não encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
  });

  return router;

};

export {GetTerms, GetTermsId};
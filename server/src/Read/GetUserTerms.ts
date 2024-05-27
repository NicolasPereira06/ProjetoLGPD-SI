import express from 'express';
import DB from '../ConnectDB/db';


function GetUserTerms(): express.Router {

    const router = express.Router();

    router.get('/GetUserTerms', async (_, res) => {
        try {
          const result = await DB.query('SELECT * FROM userterms;');
      
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

export default GetUserTerms;
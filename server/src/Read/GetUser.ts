import express from 'express';
import { DB } from '../ConnectDB/db';
import createDecryptedUsersView from '../ConnectDB/decrypted';


function ReadUserID(): express.Router {

    const router = express.Router();

    router.get('/User/:user_id', async (req, res) => {
        try {

          createDecryptedUsersView()
          
          const { user_id } = req.params;
      
          const result = await DB.query('SELECT * FROM DecryptedUsers WHERE user_id = $1', [user_id]);
      
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

function ReadUsers(): express.Router {

  const router = express.Router();

  router.get('/Users', async (req, res) => {
      try {

        createDecryptedUsersView()
    
        const result = await DB.query('SELECT * FROM DecryptedUsers');
    
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Usuário não encontrado' });
        } else {
          res.status(200).json(result.rows);
        }
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
  });
  return router;
};

export {ReadUserID, ReadUsers};
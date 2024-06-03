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
        res.status(200).json(result.rows);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;

};

function GetUserTermsLatestAcceptance(): express.Router {
  const router = express.Router();

  router.get('/GetUserTermsLatestAcceptance/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT t.terms_id, t.terms_title, t.terms_content, ut.accepted
        FROM "userterms" ut
        INNER JOIN (
          SELECT "terms_id", MAX("accepted_at") AS latest_acceptance
          FROM "userterms"
          WHERE "user_id" = $1
          GROUP BY "terms_id"
        ) subquery
        ON ut."terms_id" = subquery."terms_id" AND ut."accepted_at" = subquery.latest_acceptance
        INNER JOIN "terms" t ON ut."terms_id" = t."terms_id"
        WHERE ut."user_id" = $1 AND t."terms_mandatory" = false;
      `;

      const result = await DB.query(query, [user_id]);

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Usuário não encontrado ou sem termos aceitos' });
      } else {
        res.status(200).json(result.rows);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

export { GetUserTerms, GetUserTermsLatestAcceptance };
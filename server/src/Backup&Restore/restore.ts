import express from 'express';
import { exec } from 'child_process';

function Restore(): express.Router {
  const router = express.Router();

  // Rota para restaurar o backup do banco de dados
  router.post('/Restore', async (_, res) => {

    // Caminho do arquivo de backup
    const backupPath = 'C:\Projetos\ProjetoLGPD-SI\db';

    // Configurações de acesso ao banco de dados ElephantSQL
    const dbConfig = {
      host: 'postgres://sfnrsfac:HEN6Pe--qX857xZ5CR6j3Bqp7JLxFmsE@isabelle.db.elephantsql.com/sfnrsfac',
      port: 5432,
      user: 'sfnrsfac',
      password: 'HEN6Pe--qX857xZ5CR6j3Bqp7JLxFmsE',
      database: 'sfnrsfac'
    };

    // Comando psql para restaurar o backup
    const psqlCommand = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -f ${backupPath}`;

    // Executando o comando
    exec(psqlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao restaurar o backup: ${error.message}`);
        return res.status(500).send('Erro ao restaurar o backup');
      }
      if (stderr) {
        console.error(`Erro ao restaurar o backup: ${stderr}`);
        return res.status(500).send('Erro ao restaurar o backup');
      }
      console.log('Backup restaurado com sucesso');
      res.send('Backup restaurado com sucesso');
    });
  });

  return router;
}
export default Restore;
import express from 'express';
import { exec } from 'child_process';

function Backup(): express.Router {
    const router = express.Router();

    // Rota para realizar o backup do banco de dados com autenticação
    router.get('/Backup', async (_, res) => {

        // Configurações de acesso ao banco de dados ElephantSQL
        const dbConfig = {
        host: 'isabelle.db.elephantsql.com',
        port: 5432,
        user: 'sfnrsfac',
        password: 'HEN6Pe--qX857xZ5CR6j3Bqp7JLxFmsE',
        database: 'sfnrsfac'
        };
  
        // Nome do banco de dados
        const dbName = dbConfig.database;
        // Caminho para salvar o arquivo de backup
        const backupPath = 'C:\Projetos\ProjetoLGPD-SI\db';
  
        // Comando pg_dump para realizar o backup
        const pgDumpCommand = `pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbName} > ${backupPath}`;
  
        // Executando o comando
        exec(pgDumpCommand, (error, _stdout, stderr) => {
        if (error) {
            console.error(`Erro ao realizar o backup: ${error.message}`);
            return res.status(500).send('Erro ao realizar o backup');
        }
        if (stderr) {
            console.error(`Erro ao realizar o backup: ${stderr}`);
            return res.status(500).send('Erro ao realizar o backup');
        }
        console.log('Backup realizado com sucesso');
        res.send('Backup realizado com sucesso');
        });
    });

    return router;
}

export default Backup;
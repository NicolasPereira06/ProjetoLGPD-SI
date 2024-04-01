import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/', (_, res) => {
  res.send('Servidor Express está rodando na porta 3001');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
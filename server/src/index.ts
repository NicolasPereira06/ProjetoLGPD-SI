import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser'

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
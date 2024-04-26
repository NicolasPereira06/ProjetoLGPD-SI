import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import SignUp from './Create/PostUser';
import ReadUserID from './Read/GetUser';

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


//CRUD - Usuários

// Create
app.use('/PostUser', SignUp())

// Read
app.use('/GetUser', ReadUserID())
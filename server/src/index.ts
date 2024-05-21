import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import SignUp from './Create/PostUser';
import ReadUserID from './Read/GetUser';
import EditUser from './Update/PutUser';
import DeleteUser from './Delete/DeleteUser';
import UpdatePassword from './Update/PutPasswordUser';
import Login from './Auth/Login';
import DB from './ConnectDB/db';

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

DB.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados PostgreSQL.');
});


// Authentication

//Login
app.use('/Auth', Login())





// CRUD - Users

// Create
app.use('/PostUser', SignUp())

// Read
app.use('/GetUser', ReadUserID())

// Update
app.use('/PutUser', EditUser())
app.use('/PutPasswordUser', UpdatePassword())

// Delete
app.use('/DeleteUser', DeleteUser())
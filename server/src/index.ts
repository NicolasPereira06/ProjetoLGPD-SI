import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import SignUp from './Create/PostUser';
import { ReadUserID, ReadUsers } from './Read/GetUser';
import EditUser from './Update/PutUser';
import DeleteUser from './Delete/DeleteUser';
import UpdatePassword from './Update/PutPasswordUser';
import Login from './Auth/Login';
import {DB, DBKey} from './ConnectDB/db';
import SignUpAdmin from './Create/PostAdmin';
import { GetTerms, GetTermsId } from './Read/GetTerms';
import {GetUserTerms} from './Read/GetUserTerms';
import { GetOptional } from "./Read/GetOptional";
import AddTerm from './Create/PostTerm';
import PutTerms from './Update/PutTerms';
import DeleteTerms from './Delete/DeleteTerms';
import PostUserTerms from './Create/PostUserTerms';
import createDecryptedUsersView from './ConnectDB/decrypted';
import PostUserOptional from './Create/PostUserOptional';
import { GetUserOptional } from './Read/GetUserOptional';
import PutUserOptional from './Update/PutUserOptional';
import PostOptional from './Create/PostOptional';
import PutOptional from './Update/PutOptional';
import DeleteOptional from './Delete/DeleteOptional';

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

DBKey.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados KEY.');
});

createDecryptedUsersView()

// Authentication

//Login
app.use('/Auth', Login())





// CRUD - Users

// Create
app.use('/PostUser', SignUp())
app.use('/PostAdmin', SignUpAdmin())

// Read
app.use('/GetUser', ReadUserID())
app.use('/GetUser', ReadUsers())

// Update
app.use('/PutUser', EditUser())
app.use('/PutPasswordUser', UpdatePassword())

// Delete
app.use('/DeleteUser', DeleteUser())

// -------------------------------------------------
// CRUD - Terms

// Update
app.use('/Terms', PutTerms())

// Read
app.use('/Terms', GetTerms())
app.use('/Terms', GetTermsId())

// Create
app.use('/Terms', AddTerm())

// Delete
app.use('/DeleteTerms', DeleteTerms())

// -------------------------------------------------
// CRUD - UserTerms

// Create
app.use('/UserTerms', PostUserTerms())

// Read
app.use('/UserTerms', GetUserTerms())

// -------------------------------------------------
// CRUD - Optional

// Read
app.use('/Optional', GetOptional())

// Create
app.use('/Optional', PostOptional())

// Put
app.use('/Optional', PutOptional())

// Delete
app.use('/Optional', DeleteOptional())

// -------------------------------------------------
// CRUD - UserOptional

// Create
app.use('/UserOptional', PostUserOptional())

// Put
app.use('/UserOptional', PutUserOptional())

// Read
app.use('/UserOptional', GetUserOptional())
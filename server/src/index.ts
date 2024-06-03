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
import {GetUserTerms, GetUserTermsLatestAcceptance} from './Read/GetUserTerms';
import AddTerm from './Create/PostTerm';
import PutTerms from './Update/PutTerms';
import DeleteTerms from './Delete/DeleteTerms';
import PostUserTerms from './Create/PostUserTerms';

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

// -------------------------------------------------
// CRUD - UserTerms

// Create
app.use('/UserTerms', PostUserTerms())

// Read
app.use('/UserTerms', GetUserTerms())
app.use('/UserTerms', GetUserTermsLatestAcceptance())

// Delete
app.use('/DeleteTerms', DeleteTerms())
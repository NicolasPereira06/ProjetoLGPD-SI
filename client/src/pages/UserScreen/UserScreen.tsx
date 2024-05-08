import React from 'react';
import CustomDropdown from '../UserScreen/Dropdown';
import '../UserScreen/userscreen.css';

const UserScreen: React.FC = () => {
  return (
    <div className='container'>
      <div className='main'>
        <div className="user-screen">
          <div className="title-edit-container">
            <h1 className='title'>Meus dados</h1>
            <CustomDropdown />
          </div>
          <div className="table-container">
            <table>
              <tbody>
                <tr>
                  <th>Primeiro Nome</th>
                  <td>Usuário 1</td>
                </tr>
                <tr>
                  <th>Último Nome</th>
                  <td>Usuário 2</td>
                </tr>
                <tr>
                  <th>CPF</th>
                  <td>123.456.789-00</td>
                </tr>
                <tr>
                  <th>Data de Nascimento</th>
                  <td>01/01/1990</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>usuario1@example.com</td>
                </tr>
                <tr>
                  <th>Logradouro</th>
                  <td>Rua Exemplo</td>
                </tr>
                <tr>
                  <th>Número do Logradouro</th>
                  <td>123</td>
                </tr>
                <tr>
                  <th>Bairro</th>
                  <td>Bairro Exemplo</td>
                </tr>
                <tr>
                  <th>CEP</th>
                  <td>12345-678</td>
                </tr>
                <tr>
                  <th>Cidade</th>
                  <td>Cidade Exemplo</td>
                </tr>
                <tr>
                  <th>Estado</th>
                  <td>Estado Exemplo</td>
                </tr>
                <tr>
                  <th>Senha</th>
                  <td>********</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserScreen;

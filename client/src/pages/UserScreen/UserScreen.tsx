import React, { useState, useEffect } from 'react';
import CustomDropdown from '../UserScreen/Dropdown';
import '../UserScreen/userscreen.css';

const UserScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>({});

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/GetUser/User/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Erro ao obter dados do usuário:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
                  <td>{userData.user_first_name}</td>
                </tr>
                <tr>
                  <th>Último Nome</th>
                  <td>{userData.user_last_name}</td>
                </tr>
                <tr>
                  <th>CPF</th>
                  <td>{userData.user_cpf}</td>
                </tr>
                <tr>
                  <th>Data de Nascimento</th>
                  <td>{userData.user_date_birth}</td>
                </tr>
                <tr>
                  <th>Telefone</th>
                  <td>{userData.user_cellphone}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{userData.user_email}</td>
                </tr>
                <tr>
                  <th>Logradouro</th>
                  <td>{userData.user_address && userData.user_address.logradouro}</td>
                </tr>
                <tr>
                  <th>Número do Logradouro</th>
                  <td>{userData.user_address && userData.user_address.numero}</td>
                </tr>
                <tr>
                  <th>Bairro</th>
                  <td>{userData.user_address && userData.user_address.bairro}</td>
                </tr>
                <tr>
                  <th>CEP</th>
                  <td>{userData.user_address && userData.user_address.cep}</td>
                </tr>
                <tr>
                  <th>Cidade</th>
                  <td>{userData.user_address && userData.user_address.cidade}</td>
                </tr>
                <tr>
                  <th>Estado</th>
                  <td>{userData.user_address && userData.user_address.estado}</td>
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

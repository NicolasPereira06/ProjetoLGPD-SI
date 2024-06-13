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
              <tbody >
                <tr>
                  <th className='linha'>Primeiro Nome</th>
                  <td className='linha'>{userData.user_first_name}</td>
                </tr>
                <tr>
                  <th className='linha'>Último Nome</th>
                  <td className='linha'>{userData.user_last_name}</td>
                </tr>
                <tr>
                  <th className='linha'>CPF</th>
                  <td className='linha'>{userData.user_cpf}</td>
                </tr>
                <tr>
                  <th className='linha'>Data de Nascimento</th>
                  <td className='linha'>{userData.user_date_birth}</td>
                </tr>
                <tr>
                  <th className='linha'>Telefone</th>
                  <td className='linha'>{userData.user_cellphone}</td>
                </tr>
                <tr>
                  <th className='linha'>Email</th>
                  <td className='linha'>{userData.user_email}</td>
                </tr>
                <tr>
                  <th className='linha'>Logradouro</th>
                  <td className='linha'>{userData.user_address && userData.user_address.logradouro}</td>
                </tr>
                <tr>
                  <th className='linha'>Número do Logradouro</th>
                  <td className='linha'>{userData.user_address && userData.user_address.numero}</td>
                </tr>
                <tr>
                  <th className='linha'>Bairro</th>
                  <td className='linha'>{userData.user_address && userData.user_address.bairro}</td>
                </tr>
                <tr>
                  <th className='linha'>CEP</th>
                  <td className='linha'>{userData.user_address && userData.user_address.cep}</td>
                </tr>
                <tr>
                  <th className='linha'>Cidade</th>
                  <td className='linha'>{userData.user_address && userData.user_address.cidade}</td>
                </tr>
                <tr>
                  <th className='linha'>Estado</th>
                  <td className='linha'>{userData.user_address && userData.user_address.estado}</td>
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

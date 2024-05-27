import React, { useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AdminScreen/adminscreen.css';
import { useNavigate } from "react-router-dom";

const AdminScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  const navigate = useNavigate()

  const fetchAllUsersData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/GetUser/Users`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Erro ao obter dados dos usuários:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao obter dados dos usuários:', error);
    }
  };

  useEffect(() => {
    fetchAllUsersData();
  }, []);

  const handleSair = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleBackup = () => {
    console.log('Realizar Backup');
    // Aqui você pode adicionar a lógica para realizar o backup
  };

  const handleManagementTerm = () => {
    navigate('/managementterm')
  }

  return (
    <div className="container">
      <div className="main">
        <div className="admin-screen">
          <div className="title-edit-container">
            <h1 className="title">Usuários</h1>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Opções
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleBackup}>Realizar Backup</Dropdown.Item>
                <Dropdown.Item onClick={handleManagementTerm}>Gerenciar Termos</Dropdown.Item>
                <Dropdown.Item className="logout-item" onClick={handleSair}>Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="table-container">
            <table className="wide-table">
              <tbody>
                {userData && userData.map && userData.map((user: any, index: any) => (
                  <tr key={index}>
                    <th>{user.user_first_name} {user.user_last_name}</th>
                    <td><Button variant="primary">Restaurar</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminScreen;

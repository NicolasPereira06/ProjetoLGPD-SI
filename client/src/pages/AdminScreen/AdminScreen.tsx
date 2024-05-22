import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AdminScreen/adminscreen.css';

const AdminScreen: React.FC = () => {
  return (
    <div className="container">
      <div className="main">
        <div className="admin-screen">
          <div className="title-edit-container">
            <h1 className="title">Backups</h1>
            <Button variant="primary">Realizar Backup</Button>
          </div>
          <div className="table-container">
            <table className="wide-table">
              <tbody>
                <tr>
                  <th>Backup 1</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 2</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 3</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 4</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 5</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 6</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 7</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 8</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 9</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 10</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 11</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
                <tr>
                  <th>Backup 12</th>
                  <td><Button variant="primary">Restaurar</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminScreen;

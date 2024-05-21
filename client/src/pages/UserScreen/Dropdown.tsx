import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown, Modal, Button, Form } from 'react-bootstrap';
import '../UserScreen/Dropdown.css';
import { useNavigate } from "react-router-dom";

const CustomDropdown = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditDataModal, setShowEditDataModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate()

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/GetUser/User/${userId}`); // Substitua pelo endpoint correto
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }
      const data = await response.json();
      setUserData(data);
      setFormData(data); // Preencher o formData com os dados do usuário
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleClose = () => {
    setShowChangePasswordModal(false);
    setShowEditDataModal(false);
    setShowDeleteModal(false);
  };

  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);

  const handleShowEditDataModal = () => setShowEditDataModal(true);

  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handlePasswordChange = async () => {
    const userId = localStorage.getItem('userId');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/PutPasswordUser/UpdatePassword/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_senha_atual: passwordData.oldPassword,
          user_senha: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.message);
        throw new Error('Erro ao atualizar senha');
      } else {
        const result = await response.json();
        alert(result.message);
        handleClose();
        window.location.reload();

      }
    } catch (error) {
      console.error('Erro ao atualizar senha do usuário:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const [field, subfield] = id.split('.');
    if (subfield) {
      // Handle nested fields
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [field]: {
          ...prevFormData[field],
          [subfield]: value,
        },
      }));
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [id]: value,
    }));
  };

  const handleEditData = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:3001/PutUser/EditUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dados do usuário');
      } else {
        const result = await response.json();
        alert(result.message);
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:3001/DeleteUser/RemoveUser/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir usuário');
      } else {
        const result = await response.json();
        alert(result.message);
        localStorage.clear();
        navigate('/login')
        handleClose(); // Fecha o modal após a exclusão bem-sucedida
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };


  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="Opções" variant="primary">
        <Dropdown.Item onClick={handleShowEditDataModal}>Editar dados</Dropdown.Item>
        <Dropdown.Item onClick={handleShowChangePasswordModal}>Mudar senha</Dropdown.Item>
        <Dropdown.Item onClick={handleShowDeleteModal}>Excluir dados</Dropdown.Item>
      </DropdownButton>

      {/* Modal para editar dados */}
      <Modal show={showEditDataModal} onHide={handleClose} dialogClassName="custom-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Dados</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form>
            <div className="row">
              {/* Primeira coluna */}
              <div className="col">
                <Form.Group controlId="user_first_name">
                  <Form.Control
                    type="text"
                    placeholder="Primeiro Nome"
                    defaultValue={userData.user_first_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_last_name" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Último Nome"
                    defaultValue={userData.user_last_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_cpf" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="CPF"
                    defaultValue={userData.user_cpf}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_email" className="form-group-with-margin">
                  <Form.Control
                    type="email"
                    placeholder="E-mail"
                    defaultValue={userData.user_email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.logradouro" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Logradouro"
                    defaultValue={userData.user_address?.logradouro}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              {/* Segunda coluna */}
              <div className="col">
                <Form.Group controlId="user_address.numero">
                  <Form.Control
                    type="text"
                    placeholder="Número do Logradouro"
                    defaultValue={userData.user_address?.numero}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.bairro" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Bairro"
                    defaultValue={userData.user_address?.bairro}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.cep" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="CEP"
                    defaultValue={userData.user_address?.cep}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.cidade" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Cidade"
                    defaultValue={userData.user_address?.cidade}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.estado" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Estado"
                    defaultValue={userData.user_address?.estado}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditData}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mudar senha */}
      <Modal show={showChangePasswordModal} onHide={handleClose} dialogClassName="custom-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Mudar Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Control type="password" placeholder="Senha Antiga" onChange={handlePasswordInputChange} />
            </Form.Group>
            <Form.Group controlId="newPassword" className="form-group-with-margin">
              <Form.Control type="password" placeholder="Nova Senha" onChange={handlePasswordInputChange} />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="form-group-with-margin">
              <Form.Control type="password" placeholder="Confirmar Nova Senha" onChange={handlePasswordInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handlePasswordChange}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para excluir */}
      <Modal show={showDeleteModal} onHide={handleClose} dialogClassName="custom-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Deseja excluir os seus Dados?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center"> {/* Centraliza os botões */}
          <Button variant="secondary" onClick={handleClose}>
            Não
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomDropdown;

import React, { useState } from 'react';
import { DropdownButton, Dropdown, Modal, Button, Form } from 'react-bootstrap';
import '../UserScreen/Dropdown.css';

const CustomDropdown = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditDataModal, setShowEditDataModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleClose = () => {
    setShowChangePasswordModal(false);
    setShowEditDataModal(false);
    setShowDeleteModal(false);
  };

  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);

  const handleShowEditDataModal = () => setShowEditDataModal(true);

  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handlePasswordChange = () => {
    // Lógica para alterar a senha aqui
    handleClose(); // Fecha o modal após a alteração da senha
  };

  const handleEditData = () => {
    // Lógica para editar dados aqui
    handleClose(); // Fecha o modal após a edição de dados
  };

  const handleDelete = () => {
    // Lógica para editar dados aqui
    handleClose(); // Fecha o modal após a edição de dados
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
                <Form.Group controlId="formFirstName">
                  <Form.Control type="text" placeholder="Primeiro Nome" />
                </Form.Group>
                <Form.Group controlId="formLastName" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="Último Nome" />
                </Form.Group>
                <Form.Group controlId="formCPF" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="CPF" />
                </Form.Group>
                <Form.Group controlId="formEmail" className="form-group-with-margin">
                  <Form.Control type="email" placeholder="E-mail" />
                </Form.Group>
                <Form.Group controlId="formAddress" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="Logradouro" />
                </Form.Group>
              </div>
              {/* Segunda coluna */}
              <div className="col">
                <Form.Group controlId="formAddressNumber">
                  <Form.Control type="text" placeholder="Número do Logradouro" />
                </Form.Group>
                <Form.Group controlId="formNeighborhood" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="Bairro" />
                </Form.Group>
                <Form.Group controlId="formCEP" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="CEP" />
                </Form.Group>
                <Form.Group controlId="formCity" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="Cidade" />
                </Form.Group>
                <Form.Group controlId="formState" className="form-group-with-margin">
                  <Form.Control type="text" placeholder="Estado" />
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
            <Form.Group controlId="formOldPassword">
              <Form.Control type="password" placeholder="Senha Antiga" />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="form-group-with-margin">
              <Form.Control type="password" placeholder="Nova Senha" />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="form-group-with-margin">
              <Form.Control type="password" placeholder="Confirmar Nova Senha" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mudar senha */}
      <Modal
        show={showDeleteModal}
        onHide={handleClose}
        dialogClassName="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Deseja excluir os seus Dados?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center"> {/* Centraliza os botões */}
          <Button variant="secondary" onClick={handleClose}>
            Não
          </Button>
          <Button variant="primary" onClick={handlePasswordChange}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default CustomDropdown;

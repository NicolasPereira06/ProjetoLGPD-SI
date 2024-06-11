import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown, Modal, Button, Form } from 'react-bootstrap';
import '../UserScreen/Dropdown.css';
import { useNavigate } from "react-router-dom";

type UserTerms = {
  user_term_id: string;
  accepted: boolean;
  term_id: string;
  term_title: string;
  term_content: string;
}

type UserOptional = {
  user_optional_id: string;
  accepted: boolean;
  optional_id: string;
  optional_title: string;
  optional_content: string;
}

const CustomDropdown = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [showEditDataModal, setShowEditDataModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSairModal, setShowSairModal] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showManageTermsModal, setShowManageTermsModal] = useState(false);
  const [userTerms, setUserTerms] = useState<UserTerms[]>([]);
  const [userOpcionais, setUserOpcionais] = useState<UserOptional[]>([]);
  const [checkedOpcionais, setCheckedOpcionais] = useState<{ [key: string]: boolean }>({});

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

  const fetchUserTerms = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não identificado');
      }

      const response = await fetch(`http://localhost:3001/UserTerms/GetUserTerms/${userId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar os termos');
      }

      const data = await response.json();
      setUserTerms(data);
      console.log("Dados carregados com sucesso");
    } catch (error) {
      console.error('Erro ao buscar termos do usuário:', error);
    }
  };

  const fetchUserOptional = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não identificado');
      }

      const response = await fetch(`http://localhost:3001/UserOptional/GetUserOptional/${userId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar os opcionais');
      }

      const data = await response.json();
      setUserOpcionais(data);
      const initialCheckedState = data.reduce((acc: { [key: string]: boolean }, user_optional: UserOptional) => {
        acc[user_optional.user_optional_id] = false;
        return acc;
      }, {});
      setCheckedOpcionais(initialCheckedState);
      console.log("Dados carregados com sucesso");
    } catch (error) {
      console.error('Erro ao buscar opcionais do usuário:', error);
    }
  };

  const UpdateUserOptional = async () => {
    const formData = Object.entries(checkedOpcionais).map(([user_optional_id, accepted]) => ({
      user_optional_id,
      accepted
    }));
    console.log(formData)
    try {
      const response = await fetch('http://localhost:3001/UserOptional/PutUserOptional', {
        method: 'Put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Atualizado com sucesso');
      } else {
        const errorData = await response.json();
        alert('Erro ao atualizar termo: ' + errorData.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar termo:', error);
      alert('Erro ao atualizar termo');
    }
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedOpcionais((prevCheckedOpcionais) => ({
      ...prevCheckedOpcionais,
      [id]: !prevCheckedOpcionais[id],
    }));
    console.log(checkedOpcionais)
  };

  const handleTermClick = (id: string) => {
    localStorage.setItem('TermID', id);
    window.location.href = '/terms';
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleClose = () => {
    setShowChangePasswordModal(false);
    setShowEditDataModal(false);
    setShowDeleteModal(false);
    setShowSairModal(false);
    setShowManageTermsModal(false);
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);

  const handleShowEditDataModal = () => setShowEditDataModal(true);

  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleShowSairModal = () => setShowSairModal(true);

  const handleShowManageTermsModal = () => setShowManageTermsModal(true);

  async function searchCEP(cep: string) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (response.ok) {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);

        setFormData((prevFormData: any) => ({
          ...prevFormData,
          user_address: {
            ...prevFormData.user_address,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          },
        }));
      } else {
        setErrorMessage('CEP não encontrado. Por favor, verifique o CEP digitado.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setErrorMessage('Erro ao buscar CEP. Por favor, tente novamente.');
    }
  }

  const handlePasswordChange = async () => {
    const userId = localStorage.getItem('userId');

    const isEmpty = Object.values(passwordData).some(value => value === '' || value === null);
    if (isEmpty) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    // Verificação de senha
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      alert('A nova senha deve ter pelo menos 7 caracteres, um caractere especial e uma letra maiúscula.');
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

  function formatPhone(phone: string) {
    phone = phone.replace(/\D/g, "");
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  function formatCPF(cpf: string) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Aplica a formatação
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    } else if (cpf.length <= 9) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    } else {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    }
  }

  function formatCEP(cep: string) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    // Aplica a formatação
    if (cep.length <= 5) {
      return cep;
    } else {
      return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let formattedValue = value;

    if (id === 'user_cpf') {
      formattedValue = formatCPF(value);
    } else if (id === 'user_address.cep') {
      formattedValue = formatCEP(value);
      if (formattedValue.replace(/\D/g, '').length === 8) {  // CEP deve ter 8 dígitos
        searchCEP(formattedValue.replace(/\D/g, ''));
      }
    } else if (id === 'user_cellphone') {
      formattedValue = formatPhone(value);
    }

    const [field, subfield] = id.split('.');
    if (subfield) {
      // Handle nested fields
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [field]: {
          ...prevFormData[field],
          [subfield]: formattedValue,
        },
      }));
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [id]: formattedValue,
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

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cepRegex = /^\d{5}-\d{3}$/;
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

    const isEmpty = Object.keys(formData).some(key => {
      if (key.startsWith('user_address')) {
        // Se o campo faz parte do endereço, verifique se algum campo dentro do endereço está vazio
        return Object.values(formData[key]).some(value => value === '' || value === null);
      } else {
        // Caso contrário, verifique apenas o campo atual
        return formData[key] === '' || formData[key] === null;
      }
    });

    if (isEmpty) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (!cpfRegex.test(formData.user_cpf)) {
      alert('Por favor, insira um CPF válido.');
      return;
    }

    if (!phoneRegex.test(formData.user_cellphone)) {
      alert('Por favor, insira um número de telefone válido.');
      return;
    }

    if (!cepRegex.test(formData.user_address?.cep)) {
      alert('Por favor, insira um CEP válido.');
      return;
    }

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
        <Dropdown.Item
          onClick={() => { handleShowManageTermsModal(); fetchUserTerms(); fetchUserOptional(); }}
        >Gerenciar termos</Dropdown.Item>
        <Dropdown.Item onClick={handleShowChangePasswordModal}>Mudar senha</Dropdown.Item>
        <Dropdown.Item onClick={handleShowDeleteModal}>Excluir dados</Dropdown.Item>
        <Dropdown.Item className="logout-item" onClick={handleShowSairModal}>Sair</Dropdown.Item>
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
                    value={formData.user_cpf}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_cellphone" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Telefone"
                    value={formData.user_cellphone}
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
                    value={formData.user_address?.logradouro || logradouro}
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
                    value={formData.user_address?.bairro || bairro}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.cep" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="CEP"
                    value={formData.user_address?.cep}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.cidade" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Cidade"
                    value={formData.user_address?.cidade || cidade}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="user_address.estado" className="form-group-with-margin">
                  <Form.Control
                    type="text"
                    placeholder="Estado"
                    value={formData.user_address?.estado || estado}
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

      {/* Modal para sair */}
      <Modal show={showSairModal} onHide={handleClose} dialogClassName="custom-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Deseja sair do sistema?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Não
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para gerenciar termos */}
      <Modal show={showManageTermsModal} onHide={handleClose} dialogClassName="custom-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>Gerenciar Aceites</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          {userTerms.map((term) => (
            <li className="termField" key={term.user_term_id}>
              <span>
                {term.term_title} <a href="#" onClick={() => handleTermClick(term.term_id)}>Saiba mais</a>
              </span>
            </li>
          ))}
          {userOpcionais.map((optional) => (
            <li className="termField" key={optional.user_optional_id}>
              <input
                type="checkbox"
                name="termo"
                className="inputTerms"
                checked={!!checkedOpcionais[optional.user_optional_id]}
                onChange={() => { handleCheckboxChange(optional.user_optional_id) }}
              />
              <span>
                {optional.optional_title} <a href="#" onClick={() => handleTermClick(optional.optional_id)}>Saiba mais</a>
              </span>
            </li>
          ))}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => {
            UpdateUserOptional();
            handleClose();
          }}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default CustomDropdown;

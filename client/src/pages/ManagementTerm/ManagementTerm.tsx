import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../ManagementTerm/ManagementTerm.css";
import { useNavigate } from "react-router-dom";

type Term = {
    term_id: string;
    term_title: string;
    term_content: string;
}

type Optional = {
    optional_id: string;
    optional_title: string;
    optional_content: string;
    term_id: string;
}

const ManagementTerm: React.FC = () => {
    const [terms, setTerms] = useState<Term[]>([]);
    const [opcionais, setOpcionais] = useState<Optional[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalOptional, setShowModalOptional] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Novo estado
    const [termTitle, setTermTitle] = useState('');
    const [optionalTitle, setOptionalTitle] = useState('');
    const [termBody, setTermBody] = useState('');
    const [optionalBody, setOptionalBody] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [isUpdateOptional, setIsUpdateOptional] = useState(false);
    const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
    const [currentOptional, setCurrentOptional] = useState<Optional | null>(null);

    const fetchTerms = async () => {
        try {
            const response = await fetch('http://localhost:3001/Terms/GetTerms', {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error('Erro ao carregar os termos');
            }
            const data = await response.json();
            setTerms(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOptional = async () => {
        try {
            const response = await fetch('http://localhost:3001/Optional/GetOptional', {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error('Erro ao carregar os termos');
            }
            const data = await response.json();
            setOpcionais(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTerms();
        fetchOptional();
    }, []);

    const navigate = useNavigate();

    const handleSair = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleManagementBackup = () => {
        navigate('/adminscreen');
    };

    const handleAddTerm = () => {
        setIsUpdate(false);
        setTermTitle('');
        setTermBody('');
        setShowModal(true);
    };

    const handleAddOptional = (term: Term) => {
        setCurrentTerm(term);
        setIsUpdateOptional(false);
        setOptionalTitle('');
        setOptionalBody('');
        setShowModalOptional(true);
    };

    const handleAttOptional = (optional: Optional) => {
        setCurrentOptional(optional);
        setOptionalTitle(optional.optional_title);
        setOptionalBody(optional.optional_content);
        setIsUpdateOptional(true);
        setShowModalOptional(true);
    };

    const handleAttTerm = (term: Term) => {
        setCurrentTerm(term);
        setTermTitle(term.term_title);
        setTermBody(term.term_content);
        setIsUpdate(true);
        setShowModal(true);
    };

    const handleUpload = async () => {
        if (!termTitle || !termBody) {
            alert('Por favor, preencha todos os campos.');
            alert('Adicionado com sucesso');
            return;
        }

        const url = isUpdate ? `http://localhost:3001/Terms/PutTerms/${currentTerm?.term_id}` : 'http://localhost:3001/Terms/AddTerm';
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ term_title: termTitle, term_content: termBody })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ao adicionar/atualizar termo: ' + errorText);
            }

            const responseData = await response.json();
            if (responseData.success) {
                setShowModal(false);
                alert('Sucesso');
                await fetchTerms();
            } else {
                throw new Error('Erro ao adicionar/atualizar termo: ' + responseData.message);
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocorreu um erro desconhecido.');
            }
        }
    };

    const handleUploadOptional = async () => {
        if (!optionalTitle || !optionalBody) {
            alert('Por favor, preencha todos os campos.');
            alert('Adicionado com sucesso');
            return;
        }

        const url = isUpdateOptional ? `http://localhost:3001/Optional/PutOptional/${currentOptional?.optional_id}` : `http://localhost:3001/Optional/PostOptional/${currentTerm?.term_id}`;
        const method = isUpdateOptional ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ optional_title: optionalTitle, optional_content: optionalBody })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ao adicionar/atualizar opcional: ' + errorText);
            }

            const responseData = await response.json();
            if (responseData.success) {
                setShowModalOptional(false);
                alert('Sucesso');
                await fetchOptional();
            } else {
                throw new Error('Erro ao adicionar/atualizar opcional: ' + responseData.message);
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocorreu um erro desconhecido.');
            }
        }
    };

    const handleDeleteTerms = (termId: string) => {
        setCurrentTerm(terms.find(term => term.term_id === termId) || null);
        setShowConfirmModal(true);
    };

    const handleConfirmDeleteTerm = async () => {
        if (!currentTerm) return;

        try {
            const response = await fetch(`http://localhost:3001/DeleteTerms/DeleteTerms/${currentTerm.term_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ao excluir termo: ' + errorText);
            }

            setShowConfirmModal(false);
            await fetchTerms();
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro ao excluir termo');
            }
        }
    };

    const handleDeleteOptional = async (optional_id: string) => {
        try {
            const response = await fetch(`http://localhost:3001/Optional/DeleteOptional/${optional_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ao excluir opcional: ' + errorText);
            }
            fetchOptional();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Erro ao excluir opcional');
            }
        }
    };

    return (
        <div className="container">
            <div className="main">
                <div className="admin-screen">
                    <div className="title-edit-container">
                        <h1 className="title">Gerenciar Termos e opcionais</h1>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Opções
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleAddTerm}>Adicionar Termo</Dropdown.Item>
                                <Dropdown.Item onClick={handleManagementBackup}>Gerenciar Backups</Dropdown.Item>
                                <Dropdown.Item className="logout-item" onClick={handleSair}>Sair</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="table-container">
                        <table className="wide-table">
                            <tbody>
                                {terms.map((term, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th>{term.term_title}</th>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" id={`dropdown-basic-${index}`}>
                                                        Ações
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleAttTerm(term)}>Atualizar Termo</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleAddOptional(term)}>Adicionar Opcional</Dropdown.Item>
                                                        <Dropdown.Item className="logout-item" onClick={() => handleDeleteTerms(term.term_id)}>Excluir Termo</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                        {opcionais.filter(optional => optional.term_id === term.term_id).map((optional, optionalIndex) => (
                                            <tr key={`${index}-${optionalIndex}`}>
                                                <td style={{textAlign: 'left'}}>
                                                    {optional.optional_title}
                                                </td>
                                                <td>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id={`dropdown-basic-${index}`}>
                                                            Ações
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => handleAttOptional(optional)}>Atualizar Opcional</Dropdown.Item>
                                                            <Dropdown.Item className="logout-item" onClick={() => handleDeleteOptional(optional.optional_id)}>Excluir Opcional</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal para adicionar/atualizar termo */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isUpdate ? 'Atualizar Termo' : 'Adicionar Termo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTermTitle">
                            <Form.Label>Título do Termo</Form.Label>
                            <Form.Control type="text" value={termTitle} onChange={(e) => setTermTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formTermBody">
                            <Form.Label>Corpo do Termo</Form.Label>
                            <Form.Control as="textarea" rows={5} value={termBody} onChange={(e) => setTermBody(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        {isUpdate ? 'Atualizar' : 'Adicionar'}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal para adicionar/atualizar opcional */}
            <Modal show={showModalOptional} onHide={() => setShowModalOptional(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isUpdateOptional ? 'Atualizar Opcional' : 'Adicionar Opcional'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTermTitle">
                            <Form.Label>Título do Opcional</Form.Label>
                            <Form.Control type="text" value={optionalTitle} onChange={(e) => setOptionalTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formTermBody">
                            <Form.Label>Corpo do Opcional</Form.Label>
                            <Form.Control as="textarea" rows={5} value={optionalBody} onChange={(e) => setOptionalBody(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalOptional(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUploadOptional}>
                        {isUpdateOptional ? 'Atualizar' : 'Adicionar'}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal de confirmação para excluir termo */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja excluir o termo?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Não
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDeleteTerm}>
                        Sim
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ManagementTerm;
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../ManagementTerm/ManagementTerm.css";
import { useNavigate } from "react-router-dom";

type Term = {
    terms_id: string;
    terms_title: string;
    terms_content: string;
    terms_mandatory: boolean;
}

const ManagementTerm: React.FC = () => {
    const [terms, setTerms] = useState<Term[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Novo estado
    const [termTitle, setTermTitle] = useState('');
    const [termBody, setTermBody] = useState('');
    const [termIsMandatory, setTermIsMandatory] = useState<Boolean | null>(null); // Alterado para permitir null
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentTerm, setCurrentTerm] = useState<Term | null>(null);

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

    useEffect(() => {
        fetchTerms();
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
        setTermIsMandatory(null); // Define como null ao adicionar um novo termo
        setShowModal(true);
    };

    const handleAttTerm = (term: Term) => {
        setCurrentTerm(term);
        setTermTitle(term.terms_title);
        setTermBody(term.terms_content);
        setTermIsMandatory(term.terms_mandatory);
        setIsUpdate(true);
        setShowModal(true);
    };

    const handleUpload = async () => {
        if (!termTitle || !termBody || termIsMandatory === null) { // Verifica se o termIsMandatory não é null
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const url = isUpdate ? `http://localhost:3001/Terms/PutTerms/${currentTerm?.terms_id}` : 'http://localhost:3001/Terms/AddTerm';
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ terms_title: termTitle, terms_content: termBody, terms_mandatory: termIsMandatory })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ao adicionar/atualizar termo: ' + errorText);
            }

            const responseData = await response.json();
            if (responseData.success) {
                setShowModal(false);
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

    const handleDeleteTerms = (termId: string) => {
        setCurrentTerm(terms.find(term => term.terms_id === termId) || null);
        setShowConfirmModal(true);
    };

    const handleConfirmDeleteTerm = async () => {
        if (!currentTerm) return;

        try {
            const response = await fetch(`http://localhost:3001/DeleteTerms/DeleteTerms/${currentTerm.terms_id}`, {
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

    return (
        <div className="container">
            <div className="main">
                <div className="admin-screen">
                    <div className="title-edit-container">
                        <h1 className="title">Gerenciar Termos</h1>
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
                                    <tr key={index}>
                                        <th>{term.terms_title}</th>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="primary" id={`dropdown-basic-${index}`}>
                                                    Ações
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleAttTerm(term)}>Atualizar Termo</Dropdown.Item>
                                                    <Dropdown.Item className="logout-item" onClick={() => handleDeleteTerms(term.terms_id)}>Excluir Termo</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
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
                            <Form.Label>Título do Termo de Uso</Form.Label>
                            <Form.Control type="text" value={termTitle} onChange={(e) => setTermTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formTermBody">
                            <Form.Label>Corpo do Termo de Uso</Form.Label>
                            <Form.Control as="textarea" rows={5} value={termBody} onChange={(e) => setTermBody(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formTermIsMandatory">
                            <Form.Label>O termo é obrigatório? </Form.Label>
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="Sim"
                                    name="termIsMandatory"
                                    value={'true'}
                                    checked={termIsMandatory === true}
                                    onChange={() => setTermIsMandatory(true)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Não"
                                    name="termIsMandatory"
                                    value={'false'}
                                    checked={termIsMandatory === false}
                                    onChange={() => setTermIsMandatory(false)}
                                />
                            </Col>
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


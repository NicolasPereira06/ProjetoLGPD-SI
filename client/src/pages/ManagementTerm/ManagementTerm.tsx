import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../ManagementTerm/ManagementTerm.css";
import { useNavigate } from "react-router-dom";

type Term = {
    terms_id: string;
    terms_title: string;
    terms_content: string;
}

const ManagementTerm: React.FC = () => {
    const [terms, setTerms] = useState<Term[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [termTitle, setTermTitle] = useState('');
    const [termBody, setTermBody] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentTerm, setCurrentTerm] = useState<Term | null>(null);

    const fetchTerms = async () => {
        try {
            const response = await fetch(`http://localhost:3001/Terms/GetTerms`, {
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
        setShowModal(true);
    };

    const handleAttTerm = (term: Term) => {
        setCurrentTerm(term);
        setIsUpdate(true);
        setShowModal(true);
    };

    const handleUpload = async () => {
        if (!termTitle || !termBody) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/Terms/AddTerm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ terms_title: termTitle, terms_content: termBody })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message); // Use a propriedade correta do objeto de erro retornado pelo backend
            }
    
            setShowModal(false);
            fetchTerms(); // Atualiza a lista de termos
        } catch (error: any) {
            console.error(error);
            alert('Erro ao adicionar/atualizar termo: ' + error.message);
        }
    };

    const handleDeleteTerm = async (termId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/Terms/DeleteTerm/${termId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                
                throw new Error('Erro ao excluir termo');
            }

            fetchTerms(); // Atualiza a lista de termos após a exclusão
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir termo');
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
                                {terms && terms.map && terms.map((term, index) => (
                                    <tr key={index}>
                                        <th>{term.terms_title}</th>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                    Ações
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleAttTerm(term)}>Atualizar Termo</Dropdown.Item>
                                                    <Dropdown.Item className="logout-item" onClick={() => handleDeleteTerm(term.terms_id)}>Excluir Termo</Dropdown.Item>
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
        </div>
    );
}

export default ManagementTerm;

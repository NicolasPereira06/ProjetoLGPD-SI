import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Form } from 'react-bootstrap';
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const url = isUpdate && currentTerm ? `http://localhost:3001/Terms/UpdateTerm/${currentTerm.terms_id}` : `http://localhost:3001/Terms/AddTerm`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Erro ao fazer o upload do termo');
                }

                // Fechar o modal e atualizar a lista de termos
                setShowModal(false);
                fetchTerms();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDeleteTerm = (termId: string) => {
        // Função para deletar o termo
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
                                {terms && terms.map((term, index) => (
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

            {/* Modal para upload do termo */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isUpdate ? 'Atualizar Termo' : 'Adicionar Termo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFile">
                            <Form.Label>Selecione um arquivo PDF</Form.Label>
                            <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ManagementTerm;

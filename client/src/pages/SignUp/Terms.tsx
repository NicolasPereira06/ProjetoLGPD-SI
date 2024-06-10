import React, { useEffect, useState } from 'react';

interface Term {
    term_title: string;
    term_content: string;
}

const Terms: React.FC = () => {
    const [term, setTerm] = useState<Term | null>(null);

    useEffect(() => {
        const fetchTerm = async () => {
            try {
                const terms_id = localStorage.getItem('TermID');
                if (terms_id) {
                    const response = await fetch(`http://localhost:3001/Terms/GetTermsId/${terms_id}`);
                    const data = await response.json();
                    setTerm(data);
                }
            } catch (error) {
                console.error('Erro ao buscar o termo:', error);
            }
        };

        fetchTerm();

        // Limpa o local storage quando o componente é desmontado
        return () => {
            localStorage.removeItem('TermID');
        };
    }, []);

    if (!term) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h1>{term.term_title}</h1>
            <p>{term.term_content}</p>
        </div>
    );
};

export default Terms;
import { useState, ChangeEvent, FormEventHandler, useEffect } from "react";
import logo from "../../logo.svg";
import "./styles.css";
import { error } from "console";

type Term = {
    term_id: string;
    term_title: string;
    term_content: string;
}

type Optional = {
    optional_id: string;
    term_id: string;
    optional_title: string;
    optional_content: string;
}

function SignUp() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [opcionais, setOpcionais] = useState<Optional[]>([]);
    // const [userId, setUserId] = useState<string | null>(null);
    const [checkedTerms, setCheckedTerms] = useState<{ [key: string]: boolean }>({});
    const [checkedOptional, setCheckedOptional] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState({
        user_first_name: "",
        user_last_name: "",
        user_cpf: "",
        user_date_birth: "",
        user_cellphone: "",
        user_address: {
            logradouro: "",
            numero: "",
            bairro: "",
            cep: "",
            cidade: "",
            estado: ""
        },
        user_email: "",
        user_password: ""
    });

    const [errors, setErrors] = useState({
        user_cpf: "",
        user_address_cep: "",
        user_password: "",
        user_cellphone: "",
        general: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === "user_cpf") {
            const formattedCPF = formatCPF(value);
            setFormData(prevState => ({
                ...prevState,
                [id]: formattedCPF
            }));
            validateCPF(formattedCPF);
        } else if (id === "user_address_cep") {
            const formattedCEP = formatCEP(value);
            setFormData(prevState => ({
                ...prevState,
                user_address: {
                    ...prevState.user_address,
                    cep: formattedCEP
                }
            }));
            if (formattedCEP.length === 9) {
                searchCEP(formattedCEP);
            }
            validateCEP(formattedCEP);
        } else if (id === "user_password") {
            setFormData(prevState => ({
                ...prevState,
                [id]: value
            }));
            validatePassword(value);
        } else if (id === "user_cellphone") {
            const formattedPhone = formatPhone(value);
            setFormData(prevState => ({
                ...prevState,
                [id]: formattedPhone
            }));
            validatePhone(formattedPhone);
        } else if (id.startsWith("user_address")) {
            const addressField = id.split("_")[2]; // Obtém o nome do campo de endereço
            setFormData(prevState => ({
                ...prevState,
                user_address: {
                    ...prevState.user_address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [id]: value
            }));
        }
    };

    const formatPhone = (phone: string) => {
        phone = phone.replace(/\D/g, "");
        if (phone.length === 11) {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return phone;
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\(\d{2}\) \d{5}\-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_cellphone: "Número de telefone inválido. Formato esperado: (00) 00000-0000"
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_cellphone: ""
            }));
        }
    };

    const formatCPF = (cpf: string) => {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length <= 11) {
            return cpf.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        return cpf;
    };

    const validateCPF = (cpf: string) => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_cpf: "CPF inválido. Formato esperado: 000.000.000-00"
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_cpf: ""
            }));
        }
    };

    const formatCEP = (cep: string) => {
        cep = cep.replace(/\D/g, "");
        if (cep.length <= 8) {
            return cep.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
        }
        return cep;
    };

    const validateCEP = (cep: string) => {
        const cepRegex = /^\d{5}\-\d{3}$/;
        if (!cepRegex.test(cep)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_address_cep: "CEP inválido. Formato esperado: 00000-000"
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_address_cep: ""
            }));
        }
    };

    const validatePassword = (password: string) => {
        const uppercaseRegex = /[A-Z]/;
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < 6) {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_password: "A senha deve ter pelo menos 6 caracteres"
            }));
        } else if (!uppercaseRegex.test(password)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_password: "A senha deve conter pelo menos uma letra maiúscula"
            }));
        } else if (!specialCharsRegex.test(password)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_password: "A senha deve conter pelo menos um caractere especial"
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                user_password: ""
            }));
        }
    };

    const searchCEP = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
            const data = await response.json();
            if (response.ok) {
                setFormData(prevState => ({
                    ...prevState,
                    user_address: {
                        ...prevState.user_address,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf
                    }
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    general: 'CEP não encontrado. Por favor, verifique o CEP digitado.'
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setErrors(prevErrors => ({
                ...prevErrors,
                general: 'Erro ao buscar CEP. Por favor, tente novamente.'
            }));
        }
    };

    const clearFields = () => {
        setFormData({
            user_first_name: "",
            user_last_name: "",
            user_cpf: "",
            user_date_birth: "",
            user_cellphone: "",
            user_address: {
                logradouro: "",
                numero: "",
                bairro: "",
                cep: "",
                cidade: "",
                estado: ""
            },
            user_email: "",
            user_password: ""
        });
        setErrors({
            user_cpf: "",
            user_address_cep: "",
            user_password: "",
            user_cellphone: "",
            general: ""
        });
    };

    const validateForm = () => {
        validateCPF(formData.user_cpf);
        validateCEP(formData.user_address.cep);
        validatePassword(formData.user_password);

        return !errors.user_cpf && !errors.user_address_cep && !errors.user_password && !errors.general;
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("Por favor, corrija os erros antes de enviar o formulário.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/PostUser/SignUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                registerUserTerms(checkedTerms, data.user_id);
                registerUserOptional(checkedOptional, data.user_id);
                alert('Cadastro feito com sucesso');
                clearFields();
            } else {
                const errorData = await response.json();
                console.log(errorData)
                if (errorData.error === 'CPF já cadastrado') {
                    alert(errorData.error);
                } else if (errorData.error === 'Email já cadastrado') {
                    alert(errorData.error);
                } else {
                    alert('Erro ao cadastrar usuário');
                }
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    const registerUserTerms = async (checkedTerms: Record<string, boolean>, user_id: string) => {
        const formData = Object.entries(checkedTerms).map(([term_id, accepted]) => ({
            user_id,
            term_id,
            accepted
        }));
        try {
            const response = await fetch('http://localhost:3001/UserTerms/PostUserTerms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
            } else {
                const errorData = await response.json();
                alert('Erro ao vincular termo: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erro ao vincular termo:', error);
            alert('Erro ao vincular termo');
        }
    };

    const registerUserOptional = async (checkedOptional: Record<string, boolean>, user_id: string) => {
        const formData = Object.entries(checkedOptional).map(([optional_id, accepted]) => ({
            user_id,
            optional_id,
            accepted
        }));
        try {
            const response = await fetch('http://localhost:3001/UserOptional/PostUserOptional', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
            } else {
                const errorData = await response.json();
                alert('Erro ao vincular opicional: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erro ao vincular opicional:', error);
            alert('Erro ao vincular opicional');
        }
    };

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
            const initialCheckedState = data.reduce((acc: { [key: string]: boolean }, term: Term) => {
                acc[term.term_id] = false;
                return acc;
            }, {});
            setCheckedTerms(initialCheckedState);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOptional = async () => {
        try {
            const response = await fetch(`http://localhost:3001/Optional/GetOptional`, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error('Erro ao carregar os opcionais');
            }
            const data = await response.json();
            setOpcionais(data);
            const initialCheckedState = data.reduce((acc: { [key: string]: boolean }, optional: Optional) => {
                acc[optional.optional_id] = false;
                return acc;
            }, {});
            setCheckedOptional(initialCheckedState);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTerms();
        fetchOptional();
    }, [navigator]);

    const handleTermChange = (id: string) => {
        setCheckedTerms((prevCheckedTerms) => ({
            ...prevCheckedTerms,
            [id]: !prevCheckedTerms[id],
        }));
        console.log(checkedTerms)
    };
    const handleOptionalChange = (id: string) => {
        setCheckedOptional((prevCheckedOptional) => ({
            ...prevCheckedOptional,
            [id]: !prevCheckedOptional[id],
        }));
        console.log(checkedOptional)
    };

    const handleTermClick = (id: string) => {
        localStorage.setItem('TermID', id);
        window.location.href = '/terms';
    };

    return (
        <div className="container">
            <div className="main">
                <header className="header">
                    <img src={logo} alt="logo" />
                    <span>Preencha os campos</span>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="formContainer">
                        <div className="inputContainer">
                            <label htmlFor="primeiroNome"></label>
                            <input
                                type="text"
                                name="primeiroNome"
                                id="user_first_name"
                                placeholder="Primeiro Nome"
                                value={formData.user_first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="ultimoNome"></label>
                            <input
                                type="text"
                                name="ultimoNome"
                                id="user_last_name"
                                placeholder="Último Nome"
                                value={formData.user_last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="cpf"></label>
                            <input
                                type="text"
                                name="cpf"
                                id="user_cpf"
                                placeholder="CPF"
                                value={formData.user_cpf}
                                onChange={handleChange}
                                required
                            />
                            {errors.user_cpf && <span className="error">{errors.user_cpf}</span>}
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="dataNasc"></label>
                            <input
                                type="date"
                                name="dataNasc"
                                id="user_date_birth"
                                placeholder="Data de Nascimento"
                                value={formData.user_date_birth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="telefone"></label>
                            <input
                                type="text"
                                name="user_cellphone"
                                id="user_cellphone"
                                placeholder="Telefone"
                                value={formData.user_cellphone}
                                onChange={handleChange}
                                required
                            />
                            {errors.user_cellphone && <span className="error">{errors.user_cellphone}</span>}
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="cep"></label>
                            <input
                                type="text"
                                name="user_address_cep"
                                id="user_address_cep"
                                placeholder="CEP"
                                value={formData.user_address.cep}
                                onChange={handleChange}
                                required
                            />
                            {errors.user_address_cep && <span className="error">{errors.user_address_cep}</span>}
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="user_address_logradouro"
                                id="user_address_logradouro"
                                placeholder="Logradouro"
                                value={formData.user_address.logradouro}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="numero"></label>
                            <input
                                type="text"
                                name="user_address_numero"
                                id="user_address_numero"
                                placeholder="Número"
                                value={formData.user_address.numero}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="bairro"></label>
                            <input
                                type="text"
                                name="user_address_bairro"
                                id="user_address_bairro"
                                placeholder="Bairro"
                                value={formData.user_address.bairro}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="cidade"></label>
                            <input
                                type="text"
                                name="user_address_cidade"
                                id="user_address_cidade"
                                placeholder="Cidade"
                                value={formData.user_address.cidade}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="estado"></label>
                            <input
                                type="text"
                                name="user_address_estado"
                                id="user_address_estado"
                                placeholder="Estado"
                                value={formData.user_address.estado}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="email"></label>
                            <input
                                type="email"
                                name="email"
                                id="user_email"
                                placeholder="Email"
                                value={formData.user_email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="senha"></label>
                            <input
                                type="password"
                                name="senha"
                                id="user_password"
                                placeholder="Senha"
                                value={formData.user_password}
                                onChange={handleChange}
                                required
                            />
                            {errors.user_password && <span className="error">{errors.user_password}</span>}
                        </div>

                        <ul className="divTerms">
                            {terms.map((term) => (
                                <li className="termField" key={term.term_id}>
                                    <input
                                        type="checkbox"
                                        name="termo"
                                        className="inputTerms"
                                        checked={!!checkedTerms[term.term_id]}
                                        onChange={() => { handleTermChange(term.term_id) }}
                                        required
                                    />
                                    <span>
                                        {term.term_title} <a href="#" onClick={() => handleTermClick(term.term_id)}>Saiba mais</a>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <ul className="divTerms">
                            {opcionais.map((optional) => (
                                <li className="termField" key={optional.optional_id}>
                                    <input
                                        type="checkbox"
                                        name="termo"
                                        className="inputTerms"
                                        checked={!!checkedOptional[optional.optional_id]}
                                        onChange={() => { handleOptionalChange(optional.optional_id) }}
                                    />
                                    <span>
                                        {optional.optional_title} <a href="#" onClick={() => handleTermClick(optional.term_id)}>Saiba mais</a>
                                    </span>
                                </li>
                            ))}
                        </ul>

                    </div>
                    <button type="submit">Cadastrar</button>

                    <div className="footer">
                        <span>Voltar para o </span>
                        <a href="/login">Login</a>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default SignUp;

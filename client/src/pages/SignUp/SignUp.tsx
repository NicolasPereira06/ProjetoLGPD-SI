import { useState, ChangeEvent, FormEvent, FormEventHandler } from "react";
import logo from "../../logo.svg";
import "./styles.css";

function SignUp() {
    const [formData, setFormData] = useState({
        user_first_name: "",
        user_last_name: "",
        user_cpf: "",
        user_date_birth: "",
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id.startsWith("user_address")) {
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

    const clearFields = () => {
        setFormData({
            user_first_name: "",
            user_last_name: "",
            user_cpf: "",
            user_date_birth: "",
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
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/PostUser/SignUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if(response.ok) {
                const data = await response.json();
                console.log(data);
                clearFields()
            }


        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
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
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="dataNasc"></label>
                            <input
                                type="date"
                                name="dataNasc"
                                id="user_date_birth"
                                value={formData.user_date_birth}  
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="user_address_logradouro"
                                placeholder="Logradouro"
                                value={formData.user_address.logradouro}  
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="user_address_numero"
                                placeholder="Número do Logradouro"
                                value={formData.user_address.numero}  
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
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
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="user_address_cep"
                                id="user_address_cep"
                                placeholder="CEP"
                                value={formData.user_address.cep}  
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
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
                            <label htmlFor="endereco"></label>
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
                                type="text"
                                name="email"
                                id="user_email"
                                placeholder="Email"
                                value={formData.user_email}  
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="password"></label>
                            <input
                                type="password"
                                name="senha"
                                id="user_password"
                                placeholder="Senha"
                                value={formData.user_password}  
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="divTerms">
                        <input
                            type="checkbox"
                            name="termos"
                            className="inputTerms"
                            required
                        />
                        <span>
                            Li e estou de acordo com o
                            <a href="/terms" >Termo de Uso e Politica de Privacidade</a>
                        </span>
                    </div>

                    <button className="button" type="submit">
                        Cadastrar
                    </button>

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
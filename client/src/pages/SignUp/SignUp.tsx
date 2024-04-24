import logo from "../../logo.svg";
import "./styles.css"

function Login() {
    return (
        <div className="container">
            <div className="main">
                <header className="header">
                    <img src={logo} alt="logo" />
                    <span>Preencha os campos</span>
                </header>

                <form>
                    <div className="formContainer">
                        <div className="inputContainer">
                            <label htmlFor="primeiroNome"></label>
                            <input
                                type="text"
                                name="primeiroNome"
                                id="user_first_name"
                                placeholder="Primeiro Nome"
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
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="dataNasc"></label>
                            <input
                                type="date"
                                name="dataNasc"
                                id="user_date_birth"
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="endereco"
                                placeholder="Logradouro"
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="endereco_numero"
                                placeholder="Número do Logradouro"
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="bairro"
                                placeholder="Bairro"
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="cep"
                                placeholder="CEP"
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="cidade"
                                placeholder="Cidade"
                                required
                            />
                        </div>

                        <div className="inputContainer">
                            <label htmlFor="endereco"></label>
                            <input
                                type="text"
                                name="endereco"
                                id="estado"
                                placeholder="Estado"
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
                                required
                            />
                        </div>
                    </div>

                    <button className="button">
                        Cadastrar
                    </button>

                    <div className="footer">
                        <p>Voltar para o </p>
                        <a href="/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
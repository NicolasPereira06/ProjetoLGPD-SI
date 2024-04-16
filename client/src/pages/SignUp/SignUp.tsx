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
                    <div className="inputContainer">
                        <label htmlFor="nomeCompleto">Nome Completo</label>
                        <input
                            type="text"
                            name="nomeCompleto"
                            id="nomeCompleto"
                            placeholder="João da Silva"
                            required
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="dataNasc">Data de Nascimento</label>
                        <input
                            type="date"
                            name="dataNasc"
                            id="dataNasc"
                            required
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="teste@gmail.com"
                            required
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            id="senha"
                            placeholder="*************"
                            required
                        />
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
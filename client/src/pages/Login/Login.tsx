import Auth from "../../components/auth";
import logo from "../../logo.svg";
import "./styles.css"

function Login() {
    return (
        <div className="container">
            <div className="main">
                <header className="header">
                    <img src={logo} alt="logo" />
                    <span>Faça o seu Login</span>
                </header>

                <Auth />

                <form>
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
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            id="senha"
                            placeholder="*************"
                            required
                        />
                    </div>

                    <a href="forgotPassword">Esqueceu a senha?</a>

                    <button className="button">
                        Entrar
                    </button>

                    <div className="footer">
                        <p>Não tem uma conta?</p>
                        <a href="/signup">Crie uma aqui!</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
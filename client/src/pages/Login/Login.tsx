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
                        <label htmlFor="email"></label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="senha"></label>
                        <input
                            type="password"
                            name="senha"
                            id="senha"
                            placeholder='Senha'
                            required
                        />
                    </div>

                    <a className="esqueceusenha" href="forgotPassword">Esqueceu a senha?</a>

                    <button className="button">
                        Entrar
                    </button>

                    <div className="footer">
                        <span>Não tem uma conta? </span>
                        <a href="/signup">Crie uma aqui!</a>
                    </div>


                </form>
            </div>
        </div>
    );
}

export default Login;
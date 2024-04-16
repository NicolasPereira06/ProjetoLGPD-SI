import Auth from "../auth";
import logo from "../../logo.svg";
import "./styles.css"

function Login() {
    return (
        <div className="container">
            <header className="header">
                <img src={logo} alt="logo" />
                <span>Entre com as suas informações de conexão</span>
            </header>
            
            <Auth/>

            <form>
                <div className="inputContainer">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="teste@gmail.com" 
                    />
                </div>

                <div className="inputContainer">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="*************" 
                    />
                </div>

                <a href="forgotPassword">Esqueceu a senha?</a>

                <button className="button">
                    Entrar
                </button>

                <div className="footer">
                    <p>Não tem uma conta?</p>
                    <a href="#">Crie uma aqui!</a>
                </div>
            </form>

        </div>
    );
}

export default Login;
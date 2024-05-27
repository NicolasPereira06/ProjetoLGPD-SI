import { useState, ChangeEvent, FormEvent } from "react";
import logo from "../../logo.svg";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        user_email: "",
        user_password: ""
    });
    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userType', data.userType);
                if (data.userType === 'admin') {
                    navigate('/adminscreen')
                } else {
                    navigate('/userscreen')
                }
            } else {
                const errorData = await response.json();
                alert(`${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            // Mostrar mensagem de erro ao usuário
        }
    };

    return (
        <div className="container">
            <div className="main">
                <header className="header">
                    <img src={logo} alt="logo" />
                    <span>Faça o seu Login</span>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <label htmlFor="user_email"></label>
                        <input
                            type="text"
                            name="user_email"
                            id="user_email"
                            placeholder="Email"
                            value={formData.user_email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="inputContainer">
                        <label htmlFor="user_password"></label>
                        <input
                            type="password"
                            name="user_password"
                            id="user_password"
                            placeholder="Senha"
                            value={formData.user_password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="button" type="submit">
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

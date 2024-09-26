import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextApi } from "../../Context/context";
import './Login.css';

const LoginPage = ({ setIsLoggedIn }) => {
    const { loginUser } = useContext(ContextApi);
    const [credentials, setCredentials] = useState({ email: "", userName: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser({ e, setIsLoggedIn, credentials, navigate });
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
    };

    return (
        <div className="login-container hero-bg">
            <header className="login-header">
                <Link to="/">
                    <span id="nav-title">G<i className="fab fa-codepen"></i>emini</span>
                </Link>
            </header>

            <div className="login-form-container">
                <div className="login-form">
                    <h1 className="login-form-title">Login</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="login-input-container">
                            <label htmlFor="email" className="login-input-label">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="login-input"
                                placeholder="you@example.com"
                                id="email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="login-input-container">
                            <label htmlFor="userName" className="login-input-label">
                                Username
                            </label>
                            <input
                                type="text"
                                name="userName"
                                className="login-input"
                                placeholder="Your username"
                                id="userName"
                                value={credentials.userName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="login-input-container">
                            <label htmlFor="password" className="login-input-label">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="login-input"
                                placeholder="••••••••"
                                id="password"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="login-button" type="submit">
                            Login
                        </button>
                    </form>
                    <div className="login-footer">
                        Don't have an account?{" "}
                        <Link to="/signup" className="login-footer-link">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;






// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ContextApi } from "../../Context/context";
// import './Login.css';

// const LoginPage = ({ setIsLoggedIn }) => {
//     const { loginUser } = useContext(ContextApi)
//     const [credentials, setCredentials] = useState({ email: "", userName: "", password: "" });
//     const navigate = useNavigate();

//     const login = async () => {
//         e.preventDefault();
//         try {
//             await loginUser({ e, setIsLoggedIn, credentials, navigate });
//         } catch (error) {
//             console.error("Login failed:", error);
//             alert("Login failed. Please try again.");
//         }
//     }

//     const onChange = (e) => {
//         const { name, value } = e.target;
//         setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
//     };

//     return (
//         <div className="login-container hero-bg">
//             <header className="login-header">
//                 <Link to="/">
//                     <a id="nav-title" href="/" target="_blank">G<i className="fab fa-codepen"></i>emini</a>
//                 </Link>
//             </header>

//             <div className="login-form-container">
//                 <div className="login-form">
//                     <h1 className="login-form-title">Login</h1>

//                     <form onSubmit={login}>
//                         <div className="login-input-container">
//                             <label htmlFor="email" className="login-input-label">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 className="login-input"
//                                 placeholder="you@example.com"
//                                 id="email"
//                                 value={credentials.email}
//                                 onChange={onChange}
//                             />
//                         </div>
//                         <div className="login-input-container">
//                             <label htmlFor="userName" className="login-input-label">
//                                 Username
//                             </label>
//                             <input
//                                 type="text"
//                                 name="userName"
//                                 className="login-input"
//                                 placeholder="Your username"
//                                 id="userName"
//                                 value={credentials.userName}
//                                 onChange={onChange}
//                             />
//                         </div>
//                         <div className="login-input-container">
//                             <label htmlFor="password" className="login-input-label">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 className="login-input"
//                                 placeholder="••••••••"
//                                 id="password"
//                                 value={credentials.password}
//                                 onChange={onChange}
//                             />
//                         </div>

//                         <button className="login-button" type="submit">
//                             Login
//                         </button>
//                     </form>
//                     <div className="login-footer">
//                         Don't have an account?{" "}
//                         <Link to="/signup" className="login-footer-link">
//                             Sign Up
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;


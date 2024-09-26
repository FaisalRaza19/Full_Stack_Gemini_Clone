import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextApi } from "../../Context/context";
import './Login.css';

const SignUpPage = ({ setIsLoggedIn }) => {
    const { registerUser } = useContext(ContextApi);
    const [credentials, setCredentials] = useState({ fullName: "", email: "", userName: "", password: "" });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await registerUser({ setIsLoggedIn,credentials, navigate});
            
            setIsLoading(true)
        } catch (error) {
            console.error("Sign up failed:", error);
            alert(error.message || "Sign up failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const onChange = (e) => {
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
                    <h1 className="login-form-title">Sign Up</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="login-input-container">
                            <label htmlFor="fullName" className="login-input-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                className="login-input"
                                placeholder="Your full name"
                                id="fullName"
                                value={credentials.fullName}
                                onChange={onChange}
                            />
                        </div>
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
                                onChange={onChange}
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
                                onChange={onChange}
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
                                onChange={onChange}
                            />
                        </div>

                        <button className="login-button" type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="login-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="login-footer-link">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;







// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ContextApi } from "../../Context/context";
// import './Login.css';

// const SignUpPage = ({ setIsLoggedIn }) => {
//     const {registerUser} = useContext(ContextApi);
//     const [credentials, setCredentials] = useState({ fullName: "", email: "", userName: "", password: "" });
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//            await registerUser({e,setIsLoggedIn,navigate,credentials})

//         } catch (error) {
//             setIsLoading(false);
//             console.error("Sign up failed", error);
//             alert("Sign up failed. Please try again later.");
//         }
//     };

//     const onChange = (e) => {
//         const { name, value } = e.target;
//         setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
//     };

//     return (
//         <div className='login-container hero-bg'>
//             <header className='login-header'>
//                 <Link to="/">
//                     <a id="nav-title" href="/" target="_blank">G<i className="fab fa-codepen"></i>emini</a>
//                 </Link>
//             </header>

//             <div className='login-form-container'>
//                 <div className='login-form'>
//                     <h1 className='login-form-title'>Sign Up</h1>

//                     <form onSubmit={handleSubmit}>
//                         <div className='login-input-container'>
//                             <label htmlFor='fullName' className='login-input-label'>
//                                 Full Name
//                             </label>
//                             <input
//                                 type='text'
//                                 name='fullName'
//                                 className='login-input'
//                                 placeholder='Your full name'
//                                 id='fullName'
//                                 value={credentials.fullName}
//                                 onChange={onChange}
//                             />
//                         </div>
//                         <div className='login-input-container'>
//                             <label htmlFor='email' className='login-input-label'>
//                                 Email
//                             </label>
//                             <input
//                                 type='email'
//                                 name='email'
//                                 className='login-input'
//                                 placeholder='you@example.com'
//                                 id='email'
//                                 value={credentials.email}
//                                 onChange={onChange}
//                             />
//                         </div>
//                         <div className='login-input-container'>
//                             <label htmlFor='userName' className='login-input-label'>
//                                 Username
//                             </label>
//                             <input
//                                 type='text'
//                                 name='userName'
//                                 className='login-input'
//                                 placeholder='Your username'
//                                 id='userName'
//                                 value={credentials.userName}
//                                 onChange={onChange}
//                             />
//                         </div>
//                         <div className='login-input-container'>
//                             <label htmlFor='password' className='login-input-label'>
//                                 Password
//                             </label>
//                             <input
//                                 type='password'
//                                 name='password'
//                                 className='login-input'
//                                 placeholder='••••••••'
//                                 id='password'
//                                 value={credentials.password}
//                                 onChange={onChange}
//                             />
//                         </div>

//                         <button className='login-button' type='submit' disabled={isLoading}>
//                             {isLoading ? 'Signing Up...' : 'Sign Up'}
//                         </button>
//                     </form>
//                     <div className='login-footer'>
//                         Already have an account?{" "}
//                         <Link to="/login" className='login-footer-link'>
//                             Login
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignUpPage;


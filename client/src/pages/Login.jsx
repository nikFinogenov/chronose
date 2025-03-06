import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { NotifyContext } from '../context/NotifyContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Tooltip from '@mui/material/Tooltip';
import video from '../assets/video.mp4'
import { userStore } from '../store/userStore'; // Импортируйте userStore

function Login() {
    // const { login, user } = useContext(AuthContext);  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const showNotification = useContext(NotifyContext);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (userStore.user) {
            // showNotification("Already logged in!", 'info');
            navigate('/');
        }
    }, [navigate]);
    // }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);
        try {
            const message = await userStore.login(email, password);
            if (message) {
                // showNotification(message, 'success');
                navigate('/');
            }
        } catch (error) {
            // console.log(error);
            setServerError(error.message);
        } finally {
            setLoading(false);
        }

    };

    const handleForgot = () => {
        // navigate('/forgot-password');
    };

    return (
        loading ? (<LoadingSpinner />) : (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white px-8 pt-8 pb-4 rounded shadow-md w-80">
                    <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                            Login
                        </button>
                    </form>
                    {serverError && <div className="bg-red-500 text-white p-3 rounded mt-5">{serverError}</div>}
                    <div className="text-right mb-2">
                        <Tooltip title={
                            <div>
                                <video width="200" autoPlay>
                                    <source src={video} type="video/mp4" />
                                </video>
                            </div>
                        } placement='right' arrow>
                            <p onClick={handleForgot} className=" text-xs text-blue-500 hover:underline">Forgot password?</p>
                        </Tooltip>
                    </div>
                    <div className="text-center">
                        <a href="/register" className="text-sm text-blue-500 hover:underline">Don't have an account?</a>
                    </div>
                </div>
            </div>
        ));
}

export default Login;

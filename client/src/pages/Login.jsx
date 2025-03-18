import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Tooltip from '@mui/material/Tooltip';
import video from '../assets/video.mp4';
import { userStore } from '../store/userStore';

function Login() {
	const [emailValue, setEmailValue] = useState('');
	const [passwordValue, setPasswordValue] = useState('');
	const [serverError, setServerError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (userStore.user) {
			navigate('/');
		}
	}, [navigate]);

	const handleSubmit = async e => {
		e.preventDefault();
		setServerError('');
		setLoading(true);

		const email = emailValue.includes('@') ? emailValue : '';
		const login = email ? '' : emailValue;
	
		// const email = emailValue;
		// const login = emailValue;
		try {
			const message = await userStore.login(email, passwordValue, login); // Передаем три отдельных аргумента
			if (message) {
				navigate('/');
			}
		} catch (error) {
			setServerError(error.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	const handleForgot = () => {
		// navigate('/forgot-password');
	};

	return loading ? (
		<LoadingSpinner />
	) : (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='px-8 pt-8 pb-4 bg-white rounded shadow-md w-80'>
				<h1 className='mb-6 text-2xl font-semibold text-center'>Login</h1>
				<form onSubmit={handleSubmit} className='flex flex-col'>
					<input
						type='text'
						value={emailValue}
						onChange={e => setEmailValue(e.target.value)}
						placeholder='Email/Login'
						className='p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<input
						type='password'
						value={passwordValue}
						onChange={e => setPasswordValue(e.target.value)}
						placeholder='Password'
						className='p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<button type='submit' className='p-3 text-white bg-blue-500 rounded-md hover:bg-blue-600'>
						Login
					</button>
				</form>
				{serverError && <div className='p-3 mt-5 text-white bg-red-500 rounded'>{serverError}</div>}
				<div className='mb-2 text-right'>
					<Tooltip
						title={
							<div>
								<video width='200' autoPlay>
									<source src={video} type='video/mp4' />
								</video>
							</div>
						}
						placement='right'
						arrow
					>
						<p onClick={handleForgot} className='text-xs text-blue-500 hover:underline'>
							Forgot password?
						</p>
					</Tooltip>
				</div>
				<div className='text-center'>
					<a href='/register' className='text-sm text-blue-500 hover:underline'>
						Don't have an account?
					</a>
				</div>
			</div>
		</div>
	);
}

export default Login;

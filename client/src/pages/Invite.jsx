import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { eventStore } from '../store/eventStore';
import { calendarStore } from '../store/calendarStore';

const InvitePage = () => {
	const { inviteToken } = useParams();
	const [status, setStatus] = useState('loading'); // Правильная типизация для JSX
	const navigate = useNavigate();

	useEffect(() => {
		const join = async () => {
			if (!inviteToken) {
				setStatus('error');
				return;
			}

			try {
				// Попробуем присоединиться к ивенту
				await eventStore.joinEvent(inviteToken);
				setStatus('success');
				setTimeout(() => navigate('/'), 3000);
				return; // Если запрос успешен, выходим
			} catch (eventError) {
				console.warn('Not an event invite, trying calendar...');
			}

			try {
				// Если не получилось, пробуем присоединиться к календарю
				await calendarStore.joinCalendar(inviteToken);
				setStatus('success');
				setTimeout(() => navigate('/'), 3000);
			} catch (calendarError) {
				setStatus('error');
			}
		};

		join();
	}, [inviteToken, navigate]);

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='p-6 text-center bg-white rounded-lg shadow-md w-96'>
				{status === 'loading' && <div className='text-lg font-medium text-gray-600'>Processing invitation...</div>}

				{status === 'success' && (
					<div className='text-green-600'>
						<FiCheckCircle size={48} className='mx-auto mb-3' />
						<h2 className='text-xl font-bold'>Joined successfully!</h2>
						<p className='text-gray-600'>Redirecting to homepage...</p>
					</div>
				)}

				{status === 'error' && (
					<div className='text-red-600'>
						<FiXCircle size={48} className='mx-auto mb-3' />
						<h2 className='text-xl font-bold'>Invalid or expired invitation</h2>
						<p className='text-gray-600'>Please check your invite link.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default InvitePage;

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FiLock, FiLogOut, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/userStore';
import Notification from '../components/Notification'; // Импортируем уведомления

const Settings = observer(() => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [newFullName, setNewFullName] = useState(userStore.user?.fullName || '');
	const navigate = useNavigate();

	const handleSaveName = async () => {
		if (newFullName.trim() === '' || newFullName === userStore.user?.fullName) {
			setIsEditingName(false);
			return;
		}

		try {
			await userStore.updateUser({ fullName: newFullName });
			userStore.setNotification('Name updated successfully!', 'success');
			setIsEditingName(false);
		} catch (error) {
			userStore.setNotification('Failed to update name.', 'error');
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-6 bg-purple-100'>
			{userStore.notification && <Notification message={userStore.notification.message} type={userStore.notification.type} onClose={() => (userStore.notification = null)} />}

			<div className='w-full max-w-lg p-6 bg-white rounded-lg shadow'>
				<h2 className='mb-6 text-2xl font-bold text-center'>User Settings</h2>

				{/* Profile Section */}
				<div className='mb-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>Profile</h3>

					{/* Full Name */}
					<div className='relative flex items-center p-3 mb-3 bg-gray-100 border border-gray-300 rounded'>
						{isEditingName ? (
							<input
								id='username-input'
								type='text'
								value={newFullName}
								onChange={e => setNewFullName(e.target.value)}
								className='w-full text-lg font-medium bg-transparent border-none outline-none'
								onKeyDown={e => e.key === 'Enter' && handleSaveName()}
								onBlur={handleSaveName}
							/>
						) : (
							<div className='w-full'>
								<span className='text-sm text-gray-600'>User name</span>
								<p className='text-lg font-medium'>{userStore.user?.fullName || 'Loading...'}</p>
							</div>
						)}

						{isEditingName ? (
							<>
								<button onClick={handleSaveName} className='p-1 ml-2 text-green-600 hover:text-green-800'>
									<FiCheck size={18} />
								</button>
								<button onClick={() => setIsEditingName(false)} className='p-1 text-red-600 hover:text-red-800'>
									<FiX size={18} />
								</button>
							</>
						) : (
							<button onClick={() => setIsEditingName(true)} className='p-1 ml-2 text-blue-600 hover:text-blue-800'>
								<FiEdit2 size={18} />
							</button>
						)}
					</div>

					{/* Login */}
					<div className='p-3 mb-3 bg-gray-100 border border-gray-300 rounded'>
						<span className='text-sm text-gray-600'>Login</span>
						<p className='text-lg font-medium'>{userStore.user?.login || 'Loading...'}</p>
					</div>

					{/* Email */}
					<div className='p-3 mb-3 bg-gray-100 border border-gray-300 rounded'>
						<span className='text-sm text-gray-600'>Email</span>
						<p className='text-lg font-medium'>{userStore.user?.email || 'Loading...'}</p>
					</div>
				</div>

				{/* Security */}
				<div className='mb-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>Security</h3>
					<button
						onClick={() => userStore.requestPasswordReset()}
						className='flex items-center justify-center w-full gap-2 p-3 font-medium text-white bg-purple-600 rounded hover:bg-purple-700'
					>
						<FiLock size={18} /> Change Password
					</button>
				</div>

				{/* Account Actions */}
				<div className='mb-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>Account</h3>
					<button
						onClick={() => {
							userStore.logout();
							navigate('/');
						}}
						className='flex items-center justify-center w-full gap-2 p-3 font-medium text-white transition bg-red-500 rounded hover:bg-red-600'
					>
						<FiLogOut size={18} />
						Log Out
					</button>
					<button
						onClick={() => console.log("pidors")}
						className='flex items-center justify-center w-full gap-2 p-3 mt-4 font-medium text-white transition bg-red-700 rounded hover:bg-red-800'
					>
						<FiTrash2 size={18} />
						Delete All Calendars
					</button>
				</div>
			</div>
		</div>
	);
});

export default Settings;

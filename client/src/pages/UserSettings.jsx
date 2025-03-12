import React, { useState, useEffect } from 'react';
import { userStore } from '../store/userStore';
import { observer } from 'mobx-react-lite';
import { FiLock, FiLogOut, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const Settings = observer(() => {
	const [isEditing, setIsEditing] = useState(false);
	const [newFullName, setNewFullName] = useState('');
	const [loading, setLoading] = useState(true); // Loading state

	// When `userStore.user` updates, update `newFullName`
	useEffect(() => {
        console.log(userStore.user);
		const fetchUserData = async () => {
			if (userStore.user) {
				setNewFullName(userStore.user.fullName);
			}
			setLoading(false); // Set loading to false once user data is fetched
		};

		fetchUserData();
	}, [userStore.user]);

	useEffect(() => {
		if (isEditing) {
			// Focus the input when editing
			document.getElementById('username-input')?.focus();
		}
	}, [isEditing]);

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveUsername = async () => {
		if (newFullName.trim() === '' || newFullName === userStore.user?.fullName) {
			setIsEditing(false);
			return;
		}

		try {
			await userStore.updateUsername(newFullName);
			setIsEditing(false);
		} catch (error) {
			alert('Failed to update username');
		}
	};

	const handleChangePassword = () => {
		alert('Password change feature is not implemented yet.');
	};

	const handleDeleteCalendars = () => {
		if (window.confirm('Are you sure? This will delete ALL your calendars!')) {
			alert('All calendars have been deleted.');
		}
	};

	if (loading) {
		return <div>Loading...</div>; // Show loading state if user data is not available
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-6 bg-purple-100'>
			<div className='w-full max-w-lg p-6 bg-white rounded-lg shadow-lg'>
				<h2 className='mb-4 text-2xl font-bold text-center text-purple-700'>Account Settings</h2>

				{/* Profile Section */}
				<div className='mb-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>Profile</h3>
					<div className='relative flex items-center p-3 bg-gray-100 border border-gray-300 rounded'>
						{isEditing ? (
							<input
								id='username-input' // Add an ID for the input
								type='text'
								value={newFullName}
								onChange={e => setNewFullName(e.target.value)}
								className='flex-1 p-1 text-lg bg-transparent border-none outline-none'
								onKeyDown={e => e.key === 'Enter' && handleSaveUsername()}
							/>
						) : (
							<span className='text-lg'>{newFullName}</span>
						)}

						{/* Buttons aligned to the right */}
						<div className='absolute flex gap-2 right-2'>
							{isEditing ? (
								<>
									<button onClick={handleSaveUsername} className='p-1 text-green-600 hover:text-green-800'>
										<FiCheck size={18} />
									</button>
									<button onClick={() => setIsEditing(false)} className='p-1 text-red-600 hover:text-red-800'>
										<FiX size={18} />
									</button>
								</>
							) : (
								<button onClick={handleEditClick} className='p-1 text-gray-600 hover:text-gray-800'>
									<FiEdit2 size={18} />
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Security Section */}
				<div className='mb-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>Security</h3>
					<button
						onClick={handleChangePassword}
						className='flex items-center justify-center w-full gap-2 p-3 font-medium text-white transition bg-purple-600 rounded hover:bg-purple-700'
					>
						<FiLock size={18} />
						Change Password
					</button>
				</div>

				{/* Account Actions */}
				<div className='mb-6'>
					<h3 className='mb-2 text-lg font-semibold text-gray-800'>Account</h3>
					<button
						onClick={userStore.logout}
						className='flex items-center justify-center w-full gap-2 p-3 font-medium text-white transition bg-red-500 rounded hover:bg-red-600'
					>
						<FiLogOut size={18} />
						Log Out
					</button>
					<button
						onClick={handleDeleteCalendars}
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
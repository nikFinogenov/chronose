import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assuming User entity is in this path
import { sendResetPasswordEmail, sendConfirmationEmail } from '../utils/emailService'; // Placeholder for sending email

interface ConfirmNewPasswordParams {
	token: string;
}

interface ConfirmNewPasswordBody {
	newPassword: string;
}

export const AuthController = {
	// Register a new user
	async register(req: Request, res: Response): Promise<Response> {
		const { fullName, email, password, country }: { fullName: string; email: string; password: string; country: string; } = req.body;

		const userRepository = AppDataSource.getRepository(User);

		try {
			const existingUser = await userRepository.findOne({ where: { email } });
			if (existingUser) {
				return res.status(400).json({ message: 'Email already in use' });
			}

			// const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = userRepository.create({
				// login,
				fullName,
				email,
				password,
				country
			});

			// console.log(newUser);

			await userRepository.save(newUser);

			const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY!, { expiresIn: '1d' });
			await sendConfirmationEmail(newUser.email, token);

			return res.status(201).json({ message: 'User registered successfully. Please confirm your email.' });
		} catch (error) {
			console.error('Error registering user:', error);
			return res.status(500).json({ message: 'Failed to register user' });
		}
	},

	async me(req: Request, res: Response): Promise<Response> {
		try {
			const { token } = req.body; // Получаем токен из запроса
	
			if (!token) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
	
			// Декодируем токен
			const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
	
			const userRepository = AppDataSource.getRepository(User);
			const user = await userRepository.findOne({
				where: { id: decoded.id },
				// select: ['id', 'login', 'fullName', 'profilePicture', 'email', 'role', 'rating', 'emailConfirmed']
				select: ['id', 'fullName', 'email', 'country', 'isEmailConfirmed']
			});
	
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}
	
			return res.status(200).json({ user });
		} catch (error) {
			console.error('Error retrieving user:', error);
	
			if (error.name === 'TokenExpiredError') {
				return res.status(401).json({ error: 'Token has expired' });
			} else if (error.name === 'JsonWebTokenError') {
				return res.status(401).json({ error: 'Invalid token' });
			}
	
			return res.status(500).json({ error: 'Could not retrieve user information' });
		}
	},	

	// Confirm email
	async confirmEmail(req: Request, res: Response): Promise<Response> {
		const { token } = req.params;

		try {
			const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
			const userRepository = AppDataSource.getRepository(User);

			const user = await userRepository.findOne({ where: { email: decoded.email } });
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			user.isEmailConfirmed = true;
			await userRepository.save(user);

			return res.status(200).json({ message: 'Email successfully confirmed' });
		} catch (error) {
			return res.status(400).json({ message: 'Invalid or expired token' });
		}
	},

	// Login user
	async login(req: Request, res: Response): Promise<Response> {
		const { email, password }: { email: string; password: string } = req.body;
		// console.log(email);

		const userRepository = AppDataSource.getRepository(User);

		try {
			const user = await userRepository.findOne({ where: { email } });
			if (!user) {
				return res.status(400).json({ message: 'Invalid credentials' });
			}
			console.log(password);
			console.log(user.password);
			const isPasswordValid = await bcrypt.compare(password, user.password);
			// console.log(password, user.password);
			if (!isPasswordValid) {
				return res.status(400).json({ message: 'Invalid credentials' });
			}

			const token = jwt.sign({ id: user.id, email: user.email, country: user.country, isEmailConfirmed: user.isEmailConfirmed }, process.env.SECRET_KEY!, { expiresIn: '1h' });
			return res.status(200).json({ message: 'Login successful', token });
		} catch (error) {
			return res.status(500).json({ message: 'Login failed' });
		}
	},

	async logout(req: Request, res: Response): Promise<Response> {
		return res.status(200).json({ message: 'Came out, good chel' });
	},

	// Send reset link
	async sendResetLink(req: Request, res: Response): Promise<Response> {
		const { email }: { email: string } = req.body;

		const userRepository = AppDataSource.getRepository(User);

		try {
			const user = await userRepository.findOne({ where: { email } });
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY!, { expiresIn: '1h' });

			await sendResetPasswordEmail(user.email, token);

			return res.status(200).json({ message: 'Password reset link sent to your email' });
		} catch (error) {
			return res.status(500).json({ message: 'Failed to send reset link' });
		}
	},

	// Confirm new password
	async confirmNewPassword(req: Request<ConfirmNewPasswordParams, any, ConfirmNewPasswordBody>, res: Response): Promise<Response> {
		const { token } = req.params;
		let { newPassword }: { newPassword: string } = req.body;

		try {
			console.log(token);
			const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
			console.log(decoded);
			const userRepository = AppDataSource.getRepository(User);
			const user = await userRepository.findOne({ where: { email: decoded.email } });

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Преобразуем пароль в строку
			newPassword = String(newPassword); // Это обеспечит, что пароль будет строкой

			if (newPassword.trim() === '') {
				return res.status(400).json({ message: 'Invalid password' });
			}

			// Генерация соли и хеширование пароля
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);

			await userRepository.save(user);

			return res.status(200).json({ message: 'Password successfully updated' });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ message: 'Invalid or expired token' });
		}
	},
};

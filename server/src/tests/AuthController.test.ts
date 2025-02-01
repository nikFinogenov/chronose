import { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/emailService', () => ({
	sendResetPasswordEmail: jest.fn(),
	sendConfirmationEmail: jest.fn(),
}));

// Mock Repository
const userRepositoryMock = {
	findOne: jest.fn(),
	create: jest.fn(),
	save: jest.fn(),
};

// Mock AppDataSource.getRepository
jest.mock('../database/data-source', () => ({
	AppDataSource: {
		getRepository: jest.fn(() => userRepositoryMock),
	},
}));

describe('AuthController', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
	});

	describe('register', () => {
		it('should register a new user successfully', async () => {
			const req = {
				body: {
					fullName: 'John Doe',
					email: 'johndoe@example.com',
					password: 'password123',
				},
			} as unknown as Request;

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			} as unknown as Response;

			const hashedPassword = 'hashedPassword123';
			const token = 'mockedToken';

			(bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
			(jwt.sign as jest.Mock).mockReturnValueOnce(token);

			userRepositoryMock.findOne.mockResolvedValueOnce(null); // No user with the same email exists
			userRepositoryMock.save.mockResolvedValueOnce({ id: 1, ...req.body, password: hashedPassword });

			await AuthController.register(req, res);

			expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
			expect(userRepositoryMock.save).toHaveBeenCalledWith({
				fullName: req.body.fullName,
				email: req.body.email,
				password: hashedPassword,
			});
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				message: 'User registered successfully. Please confirm your email.',
			});
		});

		it('should return 400 if email is already in use', async () => {
			const req = {
				body: {
					fullName: 'John Doe',
					email: 'johndoe@example.com',
					password: 'password123',
				},
			} as unknown as Request;

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			} as unknown as Response;

			userRepositoryMock.findOne.mockResolvedValueOnce({ id: 1, email: req.body.email }); // User already exists

			await AuthController.register(req, res);

			expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
		});

		it('should handle server errors', async () => {
			const req = {
				body: {
					fullName: 'John Doe',
					email: 'johndoe@example.com',
					password: 'password123',
				},
			} as unknown as Request;

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			} as unknown as Response;

			userRepositoryMock.findOne.mockRejectedValueOnce(new Error('Database error'));

			await AuthController.register(req, res);

			expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: 'Failed to register user' });
		});
	});
});

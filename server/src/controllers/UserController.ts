import { Request, Response } from 'express';
import { Calendar } from '../models/Calendar';
import { User } from '../models/User';
import { Event } from '../models/Event';
import bcrypt from 'bcrypt';

export class UserController {
    // Create a new user
    static async createUser(req: Request, res: Response): Promise<Response> {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        try {
            const existingUser = await User.findOneBy({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'Email is already in use.' });
            }

            // const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({ fullName, email, password });
            await user.save();
            // const calendar = Calendar.create({
            //     name: user.fullName,
            //     description: "My personal calendar^^",
            //     owner: user
            // });
            // await calendar.save();

            return res.status(201).json({ message: 'User created successfully.', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    // Get a list of all users
    static async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await User.find({ relations: ['ownedCalendars', 'calendars'] });
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    // Get a single user by ID
    static async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({ where: { id: id }, relations: ['ownedCalendars', 'calendars'] });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    // Update a user's information
    static async updateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { fullName, email, password, isEmailConfirmed } = req.body;

        try {
            const user = await User.findOneBy({ id: id });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            if (fullName) user.fullName = fullName;
            if (email) user.email = email;
            if (password) user.password = await bcrypt.hash(password, 10);
            if (isEmailConfirmed !== undefined) user.isEmailConfirmed = isEmailConfirmed;

            await user.save();

            return res.status(200).json({ message: 'User updated successfully.', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    // Delete a user
    static async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOneBy({ id: id });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            await user.remove();
            return res.status(200).json({ message: 'User deleted successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    // Get all calendars owned by a user
    // static async getOwnedCalendars(req: Request, res: Response): Promise<Response> {
    //     const { id } = req.params;
    //     // console.log(id);

    //     try {
    //         const user = await User.findOne({ where: { id: id }, relations: ['ownedCalendars'] });
    //         if (!user) {
    //             return res.status(404).json({ message: 'User not found.' });
    //         }

    //         return res.status(200).json(user.ownedCalendars);
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: 'Internal server error.' });
    //     }
    // }

    // Get all shared calendars for a user
    static async getSharedCalendars(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({ where: { id: id }, relations: ['calendars'] });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json(user.calendars);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

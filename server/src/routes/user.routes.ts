<<<<<<< HEAD
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Get all users' });
});

router.get('/:userId', (req: Request, res: Response) => {
	res.json({ message: `Get user with ID: ${req.params.userId}` });
});

router.get('/:userId/calendars', (req: Request, res: Response) => {
	res.json({ message: `Get calendars for user with ID: ${req.params.userId}` });
});

router.patch('/:userId', (req: Request, res: Response) => {
	res.json({ message: `Update user with ID: ${req.params.userId}` });
});

router.delete('/:userId', (req: Request, res: Response) => {
	res.json({ message: `Delete user with ID: ${req.params.userId}` });
});
=======
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// TODO: what is bind and why it does not work without it
// Create a new user
router.post('/', UserController.createUser.bind(UserController));

// Get all users
router.get('/', UserController.getUsers.bind(UserController));

// Get a specific user by ID
router.get('/:id', UserController.getUserById.bind(UserController));

// Update a user's information
router.patch('/:id', UserController.updateUser.bind(UserController));

// Delete a user
router.delete('/:id', UserController.deleteUser.bind(UserController));

// Get all calendars owned by a user
router.get('/:id/owned-calendars', UserController.getOwnedCalendars.bind(UserController));

// Get all shared calendars for a user
router.get('/:id/shared-calendars', UserController.getSharedCalendars.bind(UserController));
>>>>>>> 65156c1367936da257920441ac52f0aadae5bc4d

export default router;

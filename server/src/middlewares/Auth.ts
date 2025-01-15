// import { Request, Response, NextFunction } from 'express';
// import { User } from '../models/User';
// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
// 	const token = req.headers.authorization?.split(' ')[1];

// 	if (!token) {
// 		res.status(403).json({ message: 'Access denied, no token provided' });
// 		return;
// 	}

// 	try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
// 		req.user = decoded as User; // TypeScript should recognize 'user' now
// 		next();
// 	} catch (error) {
// 		res.status(401).json({ message: 'Invalid or expired token' });
// 		return;
// 	}
// };

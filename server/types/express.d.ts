// types/express.d.ts
import { User } from '../src/models/User'; // Adjust the path to point to the correct location

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

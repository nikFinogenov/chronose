import express from 'express';
<<<<<<< HEAD
import { AppDataSource, createDatabaseIfNotExists, seedDatabase } from './src/database/data-source';
=======
import { AppDataSource, createDatabaseIfNotExists, createAdmin, seedDatabase, seedLocalEvents } from './src/database/data-source';
>>>>>>> 65156c1367936da257920441ac52f0aadae5bc4d
import { createUserAndDatabase } from "./src/database/db.create";
import userRoutes from './src/routes/user.routes';
import eventRoutes from './src/routes/event.routes';
import calendarRoutes from './src/routes/calendar.routes';
import authRoutes from './src/routes/auth.routes'
<<<<<<< HEAD

const app = express();
const PORT = 3001;
=======
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
	'http://localhost:3000',
	// `http://${IP}:3000`,
  ];

const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
  };
  app.use(cors(corsOptions));
>>>>>>> 65156c1367936da257920441ac52f0aadae5bc4d

app.use(express.json());

// Connect routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/auth', authRoutes);


// Create the database if it doesn't exist, then initialize the data source and start the server
createUserAndDatabase()
	.then(() => {
		AppDataSource.initialize()
			.then(async () => {
<<<<<<< HEAD
				console.log('Data Source has been initialized!');

				await seedDatabase();

=======
				// console.log('Data Source has been initialized!');
				// await seedDatabase();
				await createAdmin();
				await seedLocalEvents();

>>>>>>> 65156c1367936da257920441ac52f0aadae5bc4d
				app.listen(PORT, () => {
					console.log(`Server is running on http://localhost:${PORT}`);
				});
			})
			.catch(error => {
				console.error('Error during Data Source initialization:', error);
			});
	})
	.catch(error => {
		console.error('Error during database creation:', error);
	});

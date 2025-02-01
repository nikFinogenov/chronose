import express from 'express';
import { AppDataSource, createDatabaseIfNotExists, createAdmin, seedDatabase, seedLocalEvents } from './src/database/data-source';
import { createUserAndDatabase } from "./src/database/db.create";
import userRoutes from './src/routes/user.routes';
import eventRoutes from './src/routes/event.routes';
import calendarRoutes from './src/routes/calendar.routes';
import authRoutes from './src/routes/auth.routes'
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
				// console.log('Data Source has been initialized!');
				await seedDatabase();
				await createAdmin();
				//await seedLocalEvents();

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

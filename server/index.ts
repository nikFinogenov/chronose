import express from 'express';
import { AppDataSource, createDatabaseIfNotExists, seedDatabase } from './src/data-source';
import userRoutes from './src/routes/user.routes';
import eventRoutes from './src/routes/event.routes';
import calendarRoutes from './src/routes/calendar.routes';
import authRoutes from './src/routes/auth.routes'

const app = express();
const PORT = 3001;

app.use(express.json());

// Connect routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/auth', authRoutes);


// Create the database if it doesn't exist, then initialize the data source and start the server
createDatabaseIfNotExists()
	.then(() => {
		AppDataSource.initialize()
			.then(async () => {
				console.log('Data Source has been initialized!');

				await seedDatabase();

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

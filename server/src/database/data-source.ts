import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Calendar } from '../models/Calendar';
import { Client } from 'pg'; // PostgreSQL client
import { faker } from '@faker-js/faker';
require('dotenv').config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [Event, Calendar, User],
	migrations: [],
	subscribers: [],
});

export const createDatabaseIfNotExists = async () => {
	const client = new Client({
		host: 'localhost',
		port: 5432,
		user: 'postgres', // Replace with your username
		password: process.env.DB_PASS, // Replace with your password
		database: 'postgres', // Connect to the default database to create the new one
	});

	try {
		await client.connect();

		const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);

		if (result.rows.length === 0) {
			await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
			console.log(`Database '${process.env.DB_NAME}' has been created!`);
		} else {
			console.log(`Database '${process.env.DB_NAME}' already exists.`);
		}
	} catch (error) {
		console.error('Error while checking/creating the database:', error);
	} finally {
		await client.end();
	}
};


// Faker sasat
export const seedDatabase = async () => {
	try {
		console.log('Data source has been initialized. Starting to seed...');

		const userCount = await User.count();
		const calendarCount = await Calendar.count();
		const eventCount = await Event.count();

		let users = [];

		if (userCount > 0) {
			console.log('Users table is not empty. Skipping user creation.');
			users = await User.find();
		} else {
			console.log('Creating users...');
			for (let i = 0; i < 5; i++) {
				const user = User.create({
					fullName: faker.name.fullName(),
					email: faker.internet.email(),
					password: faker.internet.password(),
				});
				await user.save();
				users.push(user);
			}
			console.log('Users created:', users);
		}

		let calendars = [];
		if (calendarCount > 0) {
			console.log('Calendars table is not empty. Skipping calendar creation.');
			calendars = await Calendar.find();
		} else {
			console.log('Creating calendars...');
			for (let i = 0; i < 3; i++) {
				const calendar = Calendar.create({
					name: `Calendar ${i + 1}`,
					description: faker.lorem.sentence(),
					owner: users[i],
					users: [users[i], users[(i + 1) % users.length]],
				});
				await calendar.save();
				calendars.push(calendar);
			}
			console.log('Calendars created:', calendars);
		}

		if (eventCount > 0) {
			console.log('Events table is not empty. Skipping event creation.');
		} else {
			console.log('Creating events...');
			const events = [];
			for (const calendar of calendars) {
				for (let j = 0; j < 2; j++) {
					const startDate = faker.date.future();
					const endDate = faker.date.future({ refDate: startDate });

					const event = Event.create({
						title: faker.lorem.words(3),
						description: faker.lorem.sentence(),
						startDate,
						endDate,
						calendar,
					});
					await event.save();
					events.push(event);
				}
			}
			console.log('Events created:', events);
		}

		console.log('Database has been seeded successfully.');
	} catch (error) {
		console.error('Error seeding database:', error.message || error);
	}
};

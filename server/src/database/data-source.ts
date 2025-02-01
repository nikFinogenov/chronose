import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Calendar } from '../models/Calendar';
import { Client } from 'pg'; // PostgreSQL client
import { faker } from '@faker-js/faker';
import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
require('dotenv').config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
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

export const createAdmin = async () => {
	try {
		console.log('Creating admin user...');

		// Check if there's already an admin user with id 0
		const existingAdmin = await User.findOne({ where: { login: "admin" } });
		if (existingAdmin) {
			console.log('Admin user already exists. Skipping creation.');
			return; // If admin exists, skip creation
		}

		// Create a new admin user
		const adminUser = User.create({
			login: 'admin',
			fullName: 'Admin', // Set the name for the admin
			email: 'admin@example.com', // Admin's email
			password: 'admin', // Admin's password (you should hash this in a real application)
		});

		await adminUser.save();
		console.log('Admin user created with id 0');
	} catch (error) {
		console.error('Error creating admin user:', error.message || error);
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
					login: faker.internet.username(),
					fullName: faker.person.fullName(),
					email: faker.internet.email(),
					password: faker.internet.password(),
				});
				await user.save();
				users.push(user);
			}
			console.log(`Created ${users.length} users:`);
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
			console.log(`Created ${calendars.length} calendars:`);
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
			console.log(`Created ${events.length} events:`);
		}

		console.log('Database has been seeded successfully.');
	} catch (error) {
		console.error('Error seeding database:', error.message || error);
	}
};

export const seedLocalEvents = async () => {
    try {
        console.log('Seeding local events...');

        // Получаем все уникальные страны из cal.csv
        const countries = await getCountriesFromCSV();

        for (const country of countries) {
            const calendarId = await getCalendarId(country);
            if (!calendarId) {
                console.log(`No calendar found for location: ${country}`);
                continue; // Пропускаем, если календарь не найден
            }

            // Получаем события для данного календаря
            const events = await getEventsByCalendarId(calendarId);
            if (!events) {
                console.log(`No events found for calendar ID: ${calendarId}`);
                continue; // Пропускаем, если события не найдены
            }

            // Обрабатываем события
            const groupedEvents = processEvents(events);

            // Создаем календарь и события в базе данных
            await createCalendarAndEvents(country, groupedEvents);
		}
        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding local events:', error.message || error);
    }
};

// Функция для получения всех уникальных стран из cal.csv
const getCountriesFromCSV = async (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const countries: Set<string> = new Set();

        fs.createReadStream('cal.csv')
            .pipe(csv())
            .on('data', (data) => {
                const country = data['Religion/Country'];
                if (country) {
                    countries.add(country);
                }
            })
            .on('end', () => {
                resolve(Array.from(countries)); // Возвращаем массив уникальных стран
            })
            .on('error', (err) => reject(err));
    });
};

// Функция для получения ID календаря по стране
async function getCalendarId(location: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const results: Record<string, string>[] = [];

        fs.createReadStream('cal.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const row = results.find((row) => row['Religion/Country'] === location);
                if (row) {
                    const calendarId = row['calendarID'];
                    if (calendarId) {
                        resolve(calendarId);
                    } else {
                        resolve(process.env.CAL_ID || null);
                    }
                } else {
                    resolve(null);
                }
            })
            .on('error', (err) => reject(err));
    });
}

// Функция для получения событий по ID календаря
const getEventsByCalendarId = async (calendarId: string): Promise<any[]> => {
    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${process.env.API_KEY}`;
        const response = await axios.get(url);
        return response.data.items || [];
    } catch (error) {
        console.error(`Error fetching events for calendar ID ${calendarId}:`, error.message);
        return [];
    }
};

// Функция для обработки событий
const processEvents = (items: any[]) => {
    const groupedEvents: Record<string, { description: string, dates: string[] }> = {};
    const postfixRegex = /\s*(\([^)]+\)|observed|\(tentative\)|Suspended)+/g;

    items.forEach((item) => {
        const { summary, description, start } = item;
        const cleanedSummary = summary.replace(postfixRegex, '').trim();

        if (!groupedEvents[cleanedSummary]) {
            groupedEvents[cleanedSummary] = { description, dates: [] };
        }

        groupedEvents[cleanedSummary].dates.push(start.date);
    });

    return groupedEvents;
};

// Функция для создания календаря и событий в базе данных
const createCalendarAndEvents = async (country: string, groupedEvents: Record<string, { description: string, dates: string[] }>) => {
    const admin = await User.findOne({ where: { email: 'a_tebya_ebet_moy_email?.com' } });
	const countryCalendar = await Calendar.create({
        name: `Holidays in ${country}`,
        description: `Holidays and events for ${country}`,
		owner: admin,
		users:[admin]
    });
    await countryCalendar.save(); // Сохраняем календарь
	// console.log(countryCalendar);
    for (const [eventTitle, eventData] of Object.entries(groupedEvents)) {
        const { description, dates } = eventData;

        for (let date of dates) {
            const event = Event.create({
                title: eventTitle,
                description: description,
                startDate: new Date(date),
                endDate: new Date(date),
                calendar: countryCalendar,
            });
            await event.save(); // Сохраняем событие
            console.log(`Created event: ${eventTitle} for ${country} on ${date}`);
        }
    }
};


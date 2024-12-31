import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";
import { Calendar } from "./entity/Calendar";
import { Client } from "pg";  // PostgreSQL client

// TypeORM DataSource configuration
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres", // Replace with your username
    password: "", // Replace with your password
    database: "calendar_db",
    synchronize: true, // Automatically syncs the DB schema (not for production)
    logging: false,
    entities: [User, Event, Calendar],
    migrations: [],
    subscribers: [],
});

// Function to create the database if it doesn't exist
export const createDatabaseIfNotExists = async () => {
    const client = new Client({
        host: "localhost",
        port: 5432,
        user: "postgres",  // Replace with your username
        password: "",  // Replace with your password
        database: "postgres",  // Connect to the default database to create the new one
    });

    try {
        await client.connect();

        // Check if the database already exists
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = 'calendar_db'`
        );

        // If the database doesn't exist, create it
        if (result.rows.length === 0) {
            await client.query(`CREATE DATABASE calendar_db`);
            console.log("Database 'calendar_db' has been created!");
        } else {
            console.log("Database 'calendar_db' already exists.");
        }
    } catch (error) {
        console.error("Error while checking/creating the database:", error);
    } finally {
        await client.end();
    }
};

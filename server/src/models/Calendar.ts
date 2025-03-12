import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity, BeforeInsert } from 'typeorm';
import { User } from './User';
import { Event } from './Event';
import { randomUUID } from 'crypto';
import { AppDataSource } from '../database/data-source'; // Import AppDataSource or your connection source

@Entity()
export class Calendar extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Event, event => event.calendar, { cascade: true, onDelete: 'CASCADE' })
    events: Event[];

    @ManyToMany(() => User, user => user.calendars, { onDelete: 'CASCADE' })
    @JoinTable({
        name: 'calendar_users',
        joinColumn: { name: 'calendarId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    users: User[];

    @Column({ unique: true })
    inviteToken: string;

    @BeforeInsert()
    generateInviteToken() {
        this.inviteToken = randomUUID();
    }

    // Method to update user role
    async updateUserRole(user: User, role: "owner" | "editor" | "viewer"): Promise<void> {
		console.log("YA zashol");
        // await this.save(); // Ensure the calendar exists
		console.log("YA doshol");
		console.log(role, this.id, user.id)
        // Perform the role update in the calendar_users table
        await AppDataSource.query(`
            UPDATE calendar_users
            SET rights = $1
            WHERE "calendarId" = $2 AND "userId" = $3
        `, [role, this.id, user.id]);
		console.log("YA ZAVIS");
    }
}

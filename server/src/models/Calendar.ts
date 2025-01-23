import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity()
export class Calendar extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	description: string;

	@ManyToOne(() => User, user => user.ownedCalendars, { nullable: false })
	owner: User;

	@OneToMany(() => Event, event => event.calendar)
	events: Event[];

	@ManyToMany(() => User, user => user.calendars)
	@JoinTable({
		name: 'calendar_users',
		joinColumn: { name: 'calendarId', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
	})
	users: User[];
}

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

	@ManyToOne(() => User, user => user.ownedCalendars, { nullable: false, onDelete: 'CASCADE' })
	owner: User;

	@OneToMany(() => Event, event => event.calendar, { cascade: true, onDelete: 'CASCADE' })
	events: Event[];

	@ManyToMany(() => User, user => user.calendars, { onDelete: 'CASCADE' })
	@JoinTable({
		name: 'calendar_users',
		joinColumn: { name: 'calendarId', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
	})
	users: User[];
}

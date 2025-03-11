import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity, BeforeInsert } from 'typeorm';
import { User } from './User';
import { Event } from './Event';
import { randomUUID } from 'crypto';

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
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { Calendar } from './Calendar';
import { User } from './User';

@Entity()
export class Event extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@Column()
	startDate: Date;

	@Column()
	endDate: Date;

	@ManyToOne(() => Calendar, calendar => calendar.events, { nullable: false, onDelete: 'CASCADE' })
	calendar: Calendar;

	@ManyToMany(() => User, user => user.events, { onDelete: 'CASCADE' })
	@JoinTable({
		name: 'event_users',
		joinColumn: { name: 'eventId', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
	})
	users: User[];
}

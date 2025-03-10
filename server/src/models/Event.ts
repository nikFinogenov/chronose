import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, ManyToMany } from 'typeorm';
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
	users: User[];
}

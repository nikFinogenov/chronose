import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, BaseEntity } from 'typeorm';
import { Calendar } from './Calendar';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// @Column({ unique: true})
	// login: string;

	@Column()
	fullName: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	country: string;

	@Column()
	password: string;

	@Column({ default: false })
	isEmailConfirmed: boolean;

	@ManyToMany(() => Calendar, calendar => calendar.users)
	calendars: Calendar[];

	@OneToMany(() => Calendar, calendar => calendar.owner, { onDelete: 'CASCADE' })
	ownedCalendars: Calendar[];
}

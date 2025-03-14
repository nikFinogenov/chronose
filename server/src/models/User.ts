import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, BaseEntity, BeforeInsert, AfterInsert, JoinTable } from 'typeorm';
import { Calendar } from './Calendar';
import { Event } from './Event';
import bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	fullName: string;

	@Column({ unique: true })
	email: string;

	// @Column({ unique: true})
	// login: string;

	@Column({ nullable: true })
	country: string;

	@Column()
	password: string;

	@Column({ default: false })
	isEmailConfirmed: boolean;

	@ManyToMany(() => Calendar, (calendar) => calendar.users)
	calendars: Calendar[];

	@OneToMany(() => Calendar, (calendar) => calendar.owner, { onDelete: 'CASCADE' })
	ownedCalendars: Calendar[];

	@ManyToMany(() => Event, event => event.users, { onDelete: 'CASCADE' })
	@JoinTable({
		name: 'event_users',
		joinColumn: { name: 'userId', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'eventId', referencedColumnName: 'id' },
	})
	events: Event[];
	
	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}

	// @AfterInsert()
    // async createPersonalCalendar() {
	// 	console.log("creating calendar negt " + this.id);
	// 	const user = await User.findOne({ where: { id: this.id } }); // Загружаем пользователя
	// 	if (!user) {
	// 		console.log("out");
	// 		return;
	// 	};
    //     const calendar = Calendar.create({
    //         name: user.fullName,
    //         description: "My personal calendar^^",
    //         owner: user
    //     });

    //     await calendar.save();
    // }
}

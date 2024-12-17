import { ApiProperty } from "@nestjs/swagger";

export class Event {
    @ApiProperty({ description: "Note identifier", nullable: false })
    id: number;

    @ApiProperty({ description: "Calendar identifier", nullable: false })
    user_id: number;

    constructor(id: number, user_id: number) {
        this.id = id;
        this.user_id = user_id;
    }
}

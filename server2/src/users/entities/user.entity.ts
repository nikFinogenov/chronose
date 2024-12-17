import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty({ description: "Note identifier", nullable: false })
    id: number;

    @ApiProperty({ description: "Login", nullable: false })
    login: string;

    constructor(id: number, login: string = "") {
        this.id = id;
        this.login = login;
    }
}

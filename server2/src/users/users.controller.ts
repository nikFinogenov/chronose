import { 
  Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // обработает POST http://localhost/users
  @ApiOperation({ summary: "Creates a new user" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "User successfully created", type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // обработает GET http://localhost/users
  @ApiOperation({ summary: "Returns all users" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: User, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // обработает GET http://localhost/users/{id}
  @ApiOperation({ summary: "Returns a user with the specified id" })
  @ApiParam({ name: "id", required: true, description: "User identifier" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id') // обработает PATCH http://localhost/users/{id}
  @ApiOperation({ summary: "Updates a user with the specified id" })
  @ApiParam({ name: "id", required: true, description: "User identifier" })
  @ApiResponse({ status: HttpStatus.OK, description: "User successfully updated", type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') // обработает DELETE http://localhost/users/{id}
  @ApiOperation({ summary: "Deletes a user with the specified id" })
  @ApiParam({ name: "id", required: true, description: "User identifier" })
  @ApiResponse({ status: HttpStatus.OK, description: "User successfully deleted", type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.remove(id);
  }
}

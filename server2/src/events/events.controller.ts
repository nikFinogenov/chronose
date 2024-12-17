import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Event } from './entities/event.entity';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post() // обработает POST http://localhost/events
  @ApiOperation({ summary: "Creates a new event" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: Event })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get() // обработает GET http://localhost/events
  @ApiOperation({ summary: "Returns all available events" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: Event, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id') // обработает GET http://localhost/events/{id}
  @ApiOperation({ summary: "Returns an event with the specified id" })
  @ApiParam({ name: "id", required: true, description: "Event identifier" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: Event })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id') // обработает PATCH http://localhost/events/{id}
  @ApiOperation({ summary: "Updates an event with the specified id" })
  @ApiParam({ name: "id", required: true, description: "Event identifier" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: Event })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id') // обработает DELETE http://localhost/events/{id}
  @ApiOperation({ summary: "Deletes an event with the specified id" })
  @ApiParam({ name: "id", required: true, description: "Event identifier" })
  @ApiResponse({ status: HttpStatus.OK, description: "Success", type: Event })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.eventsService.remove(id);
  }
}

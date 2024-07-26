import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('messages')
@ApiTags('Messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Get()
  @Render('index.pug')
  async getMessageList() {
    return { message: 'Hello world!', items: this.messageService.findAll() };
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.messageService.create(body.content);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'd',
    required: false,
    type: 'string',
  })
  getMessage(@Param() id: string, @Query() d: string) {
    const message = this.messageService.findOne(id);
    if (!message) {
      throw new NotFoundException('Không tìm thấy message');
    }
    return message;
  }
}

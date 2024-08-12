import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { UsersService } from './users.service';
import {
  Serialize,
  Serializeinterceptor,
} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@ApiTags('Users')
@Controller('users')
@UseFilters(
  new I18nValidationExceptionFilter({
    detailedErrors: false,
  }),
)
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  //@UseInterceptors(new Serializeinterceptor(UserDto)) // ClassSerializerInterceptor
  @Get('/:id')
  findByUser(@Param('id') id: string) {
    console.log('handler is running');
    return this.userService.findById(parseInt(id, 0));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string) {
    return this.userService.removeById(parseInt(id, 0));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id, 0), body);
  }
}

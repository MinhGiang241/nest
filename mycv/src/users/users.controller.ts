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
  Session,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
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
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrenUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Users')
@Controller('users')
@UseFilters(
  new I18nValidationExceptionFilter({
    detailedErrors: false,
  }),
)
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    console.log('session', session);
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.userId;
  }

  @Get('/whoamisession')
  whoAmISession(@Session() session: any) {
    return this.userService.findById(session.userId);
  }

  @Get('/whoamidecorator')
  whoAmIDecorator(@CurrentUser() user: string) {
    return user;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
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
function UseGuard(): (
  target: typeof UsersController,
) => void | typeof UsersController {
  throw new Error('Function not implemented.');
}

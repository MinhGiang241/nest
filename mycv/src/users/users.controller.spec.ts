import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findById: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asas@awaa.com',
          password: '1233',
        } as User);
      },
      findOneByEmail: (email: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password: '1233',
        } as User);
      },
      // update: (id: number, attrs: Partial<User>) => Promise.resolve(id),
      // removeById: (id: number) => Promise.resolve(id),
    };
    fakeAuthService = {
      // signup: (email: string, password: string) => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('aaa@ass.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('aaa@ass.com');
  });

  it('FindUser returns a single user with the given id', async () => {
    const user = await controller.findByUser('1');
    expect(user).toBeDefined();
  });

  it('FindUser throws an  error if user with given id is not found', async () => {
    fakeUserService.findByEmail = () => null;
    try {
      await controller.findByUser('1');
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'sasd@asdad.com',
        password: '1234',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});

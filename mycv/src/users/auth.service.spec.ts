import { Test } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Tạo một phiên bản giả cho I18nService
    const fakeI18nService = {
      t: jest.fn().mockImplementation((key: string) => Promise.resolve(key)),
      translate: jest
        .fn()
        .mockImplementation((key: string) => Promise.resolve(key)),
    };

    const users: User[] = [];

    fakeUsersService = {
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: I18nService,
          useValue: fakeI18nService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service ', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asas@ads.com', 'asda');
    expect(user.password).not.toEqual('asda');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an errors if user signs up with email that is in use', async () => {
    await service.signup('k@sadas.cc', 'qweqw');
    try {
      await service.signup('k@sadas.cc', 'sss');
    } catch (err) {
      expect(err.message).toBeDefined();
    }
  });

  it('throw if signin is called with an unused email', async () => {
    try {
      await service.signin('aww@aas.cc', 'www');
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdsa@sas.ss', 's1234');
    try {
      await service.signin('asdsa@sas.ss', 'sadasd');
    } catch (err) {
      expect(err.message).toBeDefined();
    }
  });

  it('return a user if correct password is provided', async () => {
    await service.signup('asdsa@sas.ss', 'qweqw');
    const user = await service.signin('asdsa@sas.ss', 'qweqw');

    expect(user).toBeDefined();
  });
});

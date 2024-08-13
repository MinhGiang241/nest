import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.userService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the hashed resultl and salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create(email, result);

    // Return the user
    return user;
  }

  signin() {}
}

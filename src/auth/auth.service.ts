import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      const payload = { username: user.username };
      const token = await this.jwtService.signAsync(payload);

      return {
        token,
        user: result,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async findUserById(id: number): Promise<any> {
    return await this.usersService.findById(id);
  }
}

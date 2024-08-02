import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const { token, user } = await this.authService.validateUser(
      username,
      password,
    );
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { token, user };
  }

  @ApiBearerAuth()
  @Get('status')
  @UseGuards(AuthGuard)
  async status() {
    return 'status';
  }
}

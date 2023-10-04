import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupBodyDTO, AuthSignupQueryDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  async postSignup(
    @Body() signupDto: AuthSignupBodyDTO,
    @Query() query: AuthSignupQueryDTO,
  ) {
    return await this.authService.authService(signupDto, query);
  }
}

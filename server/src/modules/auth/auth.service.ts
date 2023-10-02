import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async authService() {
    return 'Signup success full';
  }
}

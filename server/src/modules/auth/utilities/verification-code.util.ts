import { Global, Injectable } from '@nestjs/common';

@Global()
@Injectable()
export class VerificationCodeUtil {
  generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

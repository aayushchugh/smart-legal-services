import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingUtil } from './utilities/hashing.util';
import { VerificationCodeUtil } from './utilities/verification-code.util';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashingUtil, VerificationCodeUtil],
})
export class AuthModule {}

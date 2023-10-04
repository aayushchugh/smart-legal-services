import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './util/mailer/mailer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, MailerModule],
  controllers: [],
})
export class AppModule {}

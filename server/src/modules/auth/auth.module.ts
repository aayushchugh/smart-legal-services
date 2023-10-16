import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import AuthTokensUtil from "./utilities/authToken.util";
import AuthHashingUtil from "./utilities/hashing.util";
import AuthEmailTemplateUtil from "./utilities/authEmailTemplate.util";
import { JwtModule } from "@nestjs/jwt";

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthHashingUtil, AuthEmailTemplateUtil, AuthTokensUtil],
	imports: [JwtModule.register({ global: true, signOptions: { algorithm: "RS256" } })],
})
export class AuthModule {}

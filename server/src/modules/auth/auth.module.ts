import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HashingUtil } from "./utilities/hashing.util";
import { AuthEmailTemplateUtil } from "./utilities/authEmailTemplate.util";

@Module({
	controllers: [AuthController],
	providers: [AuthService, HashingUtil, AuthEmailTemplateUtil],
})
export class AuthModule {}

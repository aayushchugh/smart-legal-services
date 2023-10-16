import { MiddlewareConsumer, Module, UseFilters } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { MailerModule } from "./util/mailer/mailer.module";
import { AllExceptionsFilter } from "./filters/allExceptions.filter";
import RequestLoggerMiddleware from "./middleware/requestLogger.middleware";
import { FirebaseModule } from "./util/firebase/firebase.module";
import { OtpModule } from "./util/otp/otp.module";
import DeserializeUserMiddleware from "./modules/auth/middlewares/deserializeUser.middleware";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		MailerModule,
		FirebaseModule,
		OtpModule,
	],
})
@UseFilters(AllExceptionsFilter)
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestLoggerMiddleware).forRoutes("*");
	}
}

import { MiddlewareConsumer, Module, UseFilters } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { MailerModule } from "./util/mailer/mailer.module";
import { AllExceptionsFilter } from "./filters/allExceptions.filter";
import RequestLoggerMiddleware from "./middleware/requestLogger.middleware";
import { FirebaseModule } from "./util/firebase/firebase.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, MailerModule, FirebaseModule],
	controllers: [],
})
@UseFilters(AllExceptionsFilter)
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestLoggerMiddleware).forRoutes("*");
	}
}

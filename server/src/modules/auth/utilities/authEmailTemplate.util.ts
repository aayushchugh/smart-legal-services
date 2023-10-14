import { Injectable } from "@nestjs/common";
import { MailerService } from "../../../util/mailer/mailer.service";

@Injectable()
export class AuthEmailTemplateUtil {
	constructor(private readonly mailerService: MailerService) {}

	/**
	 * Send verification email to the user's email
	 * @param userName The name of the user to whom the verification email is to be sent
	 * @param userEmail The email of the user to whom the verification email is to be sent
	 * @param otp The otp to be sent to the user
	 */
	public async sendVerificationEmail(userName: string, userEmail: string, otp: number) {
		const emailTemplate = `
			<div>
				<h1>Hey ${userName}! Welcome to Smart Legal Services</h1>
				<p>Enter this OTP: <strong>${otp}</strong>, to verify your account</p>
				<p>Please don't share this OTP with someone else</p>
			</div>
		`;

		await this.mailerService.sendEmail(userEmail, "Please verify you'r email", emailTemplate);
	}

	/**
	 * Send forgot password email to the user's email
	 * @param user The user to whom the forgot password email is to be sent
	 */
	// public async sendForgotPasswordEmail(user: User) {
	// 	const emailTemplate = `
	// 		<div>
	// 			<h1>Hey ${user.name}!</h1>
	// 			<p>Enter this OTP: <strong>${user.verificationCode}</strong>, to reset your password</p>
	// 			<p>Please don't share this OTP with anyone</p>
	// 		</div>
	// 	`;

	// 	await this.mailerService.sendEmail(
	// 		user.email,
	// 		"Reset your password for Smart Legal Services",
	// 		emailTemplate,
	// 	);
	// }
}

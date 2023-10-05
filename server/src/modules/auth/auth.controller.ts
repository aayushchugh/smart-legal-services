import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
	GetResendVerifyEmailQueryDTO,
	GetVerifyEmailParamsDTO,
	GetVerifyEmailQueryDTO,
	PostSignupBodyDTO,
	PostSignupQueryDTO,
} from "./auth.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/signup")
	@HttpCode(201)
	async postSignup(@Body() signupDto: PostSignupBodyDTO, @Query() query: PostSignupQueryDTO) {
		return await this.authService.postSignup(signupDto, query);
	}

	@Get("/signup/verify/:id")
	async getVerifyEmail(
		@Param() params: GetVerifyEmailParamsDTO,
		@Query() query: GetVerifyEmailQueryDTO,
	) {
		return await this.authService.getVerifyEmail(params, query);
	}

	@Get("/signup/verification-code/resend")
	async getResendVerifyEmail(@Query() query: GetResendVerifyEmailQueryDTO) {
		return await this.authService.getResendVerifyEmail(query);
	}
}

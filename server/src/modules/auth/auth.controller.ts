import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
	Request,
} from "@nestjs/common";
import { Request as RequestType } from "express";
import { AuthService } from "./auth.service";
import {
	GetResendVerifyEmailQueryDTO,
	GetVerifyEmailParamsDTO,
	GetVerifyEmailQueryDTO,
	PostSignupBodyDTO,
	PostSignupQueryDTO,
	PostSignupServiceProviderAttachmentsBodyDTO,
	PostSignupServiceProviderAttachmentsParamsDTO,
	PostSignupServiceProviderDetailsBodyDTO,
	PostSignupServiceProviderDetailsParamsDTO,
} from "./auth.dto";
import {
	AnyFilesInterceptor,
	FileFieldsInterceptor,
	FilesInterceptor,
} from "@nestjs/platform-express";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/signup")
	@HttpCode(201)
	async postSignup(@Body() signupDto: PostSignupBodyDTO, @Query() query: PostSignupQueryDTO) {
		return await this.authService.postSignup(signupDto, query);
	}

	@Get("/signup/:id/verify")
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

	@Post("/signup/:id/service-provider/details")
	async postSignupServiceProviderDetails(
		@Param() params: PostSignupServiceProviderDetailsParamsDTO,
		@Body() body: PostSignupServiceProviderDetailsBodyDTO,
	) {
		return await this.authService.postSignupServiceProviderDetails(params, body);
	}

	@Post("/signup/:id/service-provider/attachments")
	@UseInterceptors(AnyFilesInterceptor())
	async postSignupServiceProviderAttachments(
		@UploadedFiles() files: Express.Multer.File[],
		@Param() params: PostSignupServiceProviderAttachmentsParamsDTO,
		@Body() body: PostSignupServiceProviderAttachmentsBodyDTO,
	) {
		const license = files.find((file) => file.fieldname === "license");

		if (!license) {
			throw new BadRequestException("Missing license");
		}

		return await this.authService.postSignupServiceProviderAttachments(files, params, body);
	}
}

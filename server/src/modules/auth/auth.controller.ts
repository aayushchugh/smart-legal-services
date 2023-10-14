import {
	BadRequestException,
	Body,
	Controller,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	Query,
	UnprocessableEntityException,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
	GetResendVerifyEmailQueryDTO,
	GetVerifyEmailParamsDTO,
	GetVerifyEmailQueryDTO,
	PostAdminVerifyServiceProviderParamsDTO,
	PostSignupBodyDTO,
	PostSignupQueryDTO,
	PostSignupServiceProviderAttachmentsBodyDTO,
	PostSignupServiceProviderAttachmentsParamsDTO,
	PostSignupServiceProviderDetailsBodyDTO,
	PostSignupServiceProviderDetailsParamsDTO,
} from "./auth.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

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
		@UploadedFiles(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 4000000 }), // 4 mb
					new FileTypeValidator({ fileType: /^(image\/jpeg|image\/jpg|image\/png)$/ }),
				],
				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				exceptionFactory() {
					return new UnprocessableEntityException(
						"You can only upload .png, .jpg or .jpeg less than 4mb",
					);
				},
			}),
		)
		files: Express.Multer.File[],
		@Param() params: PostSignupServiceProviderAttachmentsParamsDTO,
		@Body() body: PostSignupServiceProviderAttachmentsBodyDTO,
	) {
		const license = files.find((file) => file.fieldname === "license");

		if (!license) {
			throw new BadRequestException("Missing license");
		}

		return await this.authService.postSignupServiceProviderAttachments(files, params, body);
	}

	@Post("/admin/auth/verify-service-provider/:id")
	async postAdminVerifyServiceProvider(@Param() params: PostAdminVerifyServiceProviderParamsDTO) {
		return await this.authService.postAdminVerifyServiceProvider(params);
	}
}

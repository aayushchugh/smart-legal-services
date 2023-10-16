import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import {
	GetResendVerifyEmailQueryDTO,
	GetVerifyEmailBodyDTO,
	GetVerifyEmailParamsDTO,
	PostLoginBodyDTO,
	PostLoginVerifyBodyDTO,
	PostLoginVerifyParamsDTO,
	PostSignupBodyDTO,
	PostSignupQueryDTO,
	PostSignupServiceProviderAttachmentsBodyDTO,
	PostSignupServiceProviderAttachmentsParamsDTO,
	PostSignupServiceProviderDetailsBodyDTO,
	PostSignupServiceProviderDetailsParamsDTO,
} from "./auth.dto";
import { Prisma, User, UserServiceProviderDetailsQualifications } from "@prisma/client";
import prisma from "../../common/database/prisma";
import { FirebaseService } from "../../util/firebase/firebase.service";
import { OtpService } from "../../util/otp/otp.service";
import AuthHashingUtil from "./utilities/hashing.util";
import AuthEmailTemplateUtil from "./utilities/authEmailTemplate.util";
import AuthTokensUtil from "./utilities/authToken.util";

@Injectable()
export class AuthService {
	constructor(
		private readonly hashingUtility: AuthHashingUtil,
		private readonly authEmailTemplateUtil: AuthEmailTemplateUtil,
		private readonly firebaseService: FirebaseService,
		private readonly OtpService: OtpService,
		private readonly authTokenUtil: AuthTokensUtil,
	) {}

	async postSignup(body: PostSignupBodyDTO, query: PostSignupQueryDTO) {
		try {
			// hash password
			const hashedPassword = await this.hashingUtility.generateHash(body.password);

			// create user in database
			const createdUser = await prisma.user.create({
				data: {
					name: body.name,
					email: body.email,
					password: hashedPassword,
					phone: body.phone,
					role: query.type === "serviceProvider" ? "serviceProvider" : "user",
					isVerified: false,
					address: {
						city: body.address.city,
						state: body.address.state,
						pinCode: body.address.pinCode,
						addressLine1: body.address.addressLine1,
						addressLine2: body.address.addressLine2 ? body.address.addressLine2 : null,
					},
				},
			});

			const otp = await this.OtpService.generateOtp(createdUser.id, "signup");

			// send code to email
			await this.authEmailTemplateUtil.sendSignupVerificationEmail(
				createdUser.name,
				createdUser.email,
				otp.otp,
			);

			return Promise.resolve({
				statusCode: HttpStatus.CREATED,
				message: "User created successfully",
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
				throw new ConflictException("Account with this email or username already exists");
			}

			return Promise.reject(err);
		}
	}

	async getVerifyEmail(params: GetVerifyEmailParamsDTO, body: GetVerifyEmailBodyDTO) {
		try {
			// get user from db
			const user = await prisma.user.findUniqueOrThrow({
				where: { email: params.email },
				include: { otps: true },
			});

			// check if user already verified
			if (user.isVerified) {
				throw new ConflictException("user already verified", "APP_USER_ALREADY_VERIFIED");
			}

			// check if otp is valid
			const isOtpCorrect = await this.OtpService.verifyOtp(user.id, +body.otp, "signup");

			if (!isOtpCorrect) {
				throw new BadRequestException("Invalid OTP", "APP_INVALID_OTP");
			}

			await prisma.user.update({
				where: { email: params.email },
				data: { isVerified: true },
			});

			return Promise.resolve({
				statusCode: HttpStatus.OK,
				message: "user verified successfully",
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2023" || err.code === "P2025")
			) {
				throw new NotFoundException("invalid email");
			}

			return Promise.reject(err);
		}
	}

	async getResendVerifyEmail(query: GetResendVerifyEmailQueryDTO) {
		try {
			// get user from database
			const user = await prisma.user.findUniqueOrThrow({
				where: { email: query.e },
			});

			// check if user already verified
			if (user.isVerified) {
				throw new ConflictException("user already verified");
			}

			// delete previous otps
			await prisma.otp.deleteMany({ where: { userId: user.id, reason: "signup" } });

			// generate new verification code
			const otp = await this.OtpService.generateOtp(user.id, "signup");

			// send code to email
			await this.authEmailTemplateUtil.sendSignupVerificationEmail(user.name, user.email, otp.otp);

			return Promise.resolve({
				statusCode: HttpStatus.OK,
				message: "email sent successfully",
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2023" || err.code === "P2025")
			) {
				throw new NotFoundException("invalid email");
			}

			return Promise.reject(err);
		}
	}

	async postSignupServiceProviderDetails(
		params: PostSignupServiceProviderDetailsParamsDTO,
		body: PostSignupServiceProviderDetailsBodyDTO,
	) {
		try {
			// find user
			const user = await prisma.user.findUniqueOrThrow({
				where: { email: params.email },
			});

			// check if user is verified
			if (!user.isVerified) {
				throw new ForbiddenException("user is not verified");
			}

			// update user
			await prisma.user.update({
				where: { email: params.email },
				data: {
					serviceProviderDetails: {
						set: {
							experience: body.experience,
							isBarAssociationMember: body.isBarAssociationMember ? true : false,
							overAllRating: {
								average: 0,
								behavior: 0,
								communication: 0,
								efficiency: 0,
								worth: 0,
							},
							services: body.services,
						},
					},
				},
			});

			return Promise.resolve({
				statusCode: HttpStatus.OK,
				message: "service provider details added successfully",
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2023" || err.code === "P2025")
			) {
				throw new NotFoundException("invalid email");
			}

			return Promise.reject(err);
		}
	}

	async postSignupServiceProviderAttachments(
		files: Express.Multer.File[],
		params: PostSignupServiceProviderAttachmentsParamsDTO,
		body: PostSignupServiceProviderAttachmentsBodyDTO,
	) {
		try {
			// find user
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					email: params.email,
				},
			});

			if (!user.isVerified) {
				throw new ForbiddenException("user is not verified");
			}

			const licenseFile = files.find((file) => file.fieldname === "license");

			const qualificationFiles = files.filter((file) => file.fieldname !== "license");

			// upload files to firebase
			const licenseFileName = `${user.name}-${user.id}-${
				licenseFile.originalname
			}-${new Date().toISOString()}`;

			const licenseUrl = await this.firebaseService.uploadImageBuffer(
				licenseFile.buffer,
				licenseFileName,
				{ contentType: licenseFile.mimetype },
			);

			const parsedBody: { title: string; type: string }[] = JSON.parse(body.qualifications);

			const uploadedQualifications: UserServiceProviderDetailsQualifications[] = [];

			for (let i = 0; i < qualificationFiles.length; i++) {
				const file = qualificationFiles[i];

				const qualificationFileName = `${user.name}-${user.id}-${
					file.originalname
				}-${new Date().toISOString()}`;

				// upload file to firebase
				const uploadedFile = await this.firebaseService.uploadImageBuffer(
					file.buffer,
					qualificationFileName,
					{
						contentType: file.mimetype,
					},
				);

				const fileUrl = await this.firebaseService.getFileUrl(uploadedFile.ref.fullPath);

				const qualificationTitle = parsedBody.find((item) => item.type === file.fieldname).title;

				// push file to uploadQualifications
				uploadedQualifications.push({
					title: qualificationTitle,
					type: file.fieldname,
					proof: {
						fileName: qualificationFileName,
						url: fileUrl,
					},
				});
			}

			// set license in database
			await prisma.user.update({
				where: { email: params.email },
				data: {
					serviceProviderDetails: {
						set: {
							...user.serviceProviderDetails,
							license: {
								fileName: licenseFileName,
								url: await this.firebaseService.getFileUrl(licenseUrl.ref.fullPath),
							},
							qualifications: uploadedQualifications,
						},
					},
				},
			});

			return Promise.resolve({
				statusCode: HttpStatus.OK,
				message: "attachments uploaded successfully",
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2023" || err.code === "P2025")
			) {
				throw new NotFoundException("invalid email");
			}

			return Promise.reject(err);
		}
	}

	async postLogin(body: PostLoginBodyDTO) {
		try {
			let user: User;

			// find user
			if (body.emailPhone.includes("@")) {
				user = await prisma.user.findUniqueOrThrow({
					where: { email: body.emailPhone },
				});
			} else {
				user = await prisma.user.findUniqueOrThrow({
					where: { phone: +body.emailPhone },
				});
			}

			// check if user is verified
			if (!user.isVerified) {
				throw new ForbiddenException("user is not verified", "APP_USER_NOT_VERIFIED");
			}

			// check if user is service provider and is verified
			if (
				user.role === "serviceProvider" &&
				user.serviceProviderDetails &&
				!user.serviceProviderDetails.isVerified
			) {
				throw new ForbiddenException(
					"service provider is not verified",
					"APP_SERVICE_PROVIDER_NOT_VERIFIED",
				);
			}

			if (user.blocked && user.blocked.isBlocked) {
				throw new ForbiddenException("user is blocked", "APP_USER_BLOCKED");
			}

			// TODO: check if user has completed the payment

			// check if password is correct
			const isPasswordCorrect = await this.hashingUtility.compareHash(body.password, user.password);

			if (!isPasswordCorrect) {
				throw new UnauthorizedException("invalid password", "APP_INVALID_PASSWORD");
			}

			// generate otp for login
			const otp = await this.OtpService.generateOtp(user.id, "login");

			// send otp to user
			await this.authEmailTemplateUtil.sendLoginVerificationEmail(user.name, user.email, otp.otp);

			return Promise.resolve({
				statusCode: HttpStatus.OK,
				message: "login otp sent successfully",
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2023" || err.code === "P2025")
			) {
				throw new NotFoundException("invalid email");
			}

			return Promise.reject(err);
		}
	}

	async postLoginVerify(params: PostLoginVerifyParamsDTO, body: PostLoginVerifyBodyDTO) {
		try {
			// find user
			const user = await prisma.user.findUniqueOrThrow({
				where: { email: params.email },
				include: { otps: true },
			});

			// check if user is verified
			if (!user.isVerified) {
				throw new ForbiddenException("user is not verified", "APP_USER_NOT_VERIFIED");
			}

			// check if user is service provider and is verified
			if (
				user.role === "serviceProvider" &&
				user.serviceProviderDetails &&
				!user.serviceProviderDetails.isVerified
			) {
				throw new ForbiddenException(
					"service provider is not verified",
					"APP_SERVICE_PROVIDER_NOT_VERIFIED",
				);
			}

			if (user.blocked && user.blocked.isBlocked) {
				throw new ForbiddenException("user is blocked", "APP_USER_BLOCKED");
			}

			// TODO: check if payment is completed

			// validate otp
			const isOtpCorrect = await this.OtpService.verifyOtp(user.id, +body.otp, "login");

			if (!isOtpCorrect) {
				throw new BadRequestException("Invalid OTP", "APP_INVALID_OTP");
			}

			// generate jwt token
			const accessToken = await this.authTokenUtil.signAccessToken(user.id);

			const session = await prisma.session.create({
				data: {
					user: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			// const refreshToken = await this.authTokenUtil.signRefreshToken(session.id);
			const refreshToken = await this.authTokenUtil.signRefreshToken(session.id);
			return Promise.resolve({
				statusCode: HttpStatus.OK,
				message: "login successful",
				data: {
					accessToken,
					refreshToken,
				},
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2023" || err.code === "P2025")
			) {
				throw new NotFoundException("invalid email");
			}

			return Promise.reject(err);
		}
	}

	// async postAdminVerifyServiceProvider(params: PostAdminVerifyServiceProviderParamsDTO) {}
}

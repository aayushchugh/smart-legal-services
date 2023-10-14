import { UserRole } from "@prisma/client";
import { Equals, IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

class AuthSignupAddressDTO {
	@IsNotEmpty({ message: "city is required" })
	@IsString({ message: "city is not a valid string" })
	readonly city: string;

	@IsNotEmpty({ message: "state is required" })
	@IsString({ message: "state is not a valid string" })
	readonly state: string;

	@IsNotEmpty({ message: "pin code is required" })
	@IsNumber({}, { message: "pin code is not a valid number" })
	@Min(100000, { message: "pin code must be of 6 digits" })
	@Max(999999, { message: "pin code must be of 6 digits" })
	readonly pinCode: number;

	@IsNotEmpty({ message: "address line 1 is not found" })
	@IsString({ message: "address line 1 is not a valid string" })
	addressLine1: string;

	@IsString({ message: "address line 2 should be a valid string" })
	addressLine2: string;
}

export class PostSignupBodyDTO {
	@IsNotEmpty({ message: "name is required" })
	@IsString({ message: "Please enter a valid string" })
	readonly name: string;

	@IsNotEmpty({ message: "email is required" })
	@IsEmail({}, { message: "Please enter a valid email" })
	@IsString({ message: "Please enter a valid string" })
	readonly email: string;

	@IsNotEmpty({ message: "password is required" })
	@IsString({ message: "Please enter a valid string" })
	readonly password: string;

	@IsNotEmpty({ message: "cpassword is required" })
	@Equals("password", { message: "cpassword and password do not match" })
	@IsString({ message: "Please enter a valid string" })
	readonly cpassword: string;

	@IsNotEmpty({ message: "phone is required" })
	@Min(1000000000, { message: "phone should be 10 digits" })
	@Max(9999999999, { message: "phone should be 10 digits" })
	@IsNumber({}, { message: "Please enter a valid number" })
	readonly phone: number;

	@IsNotEmpty({ message: "address is required" })
	address: AuthSignupAddressDTO;
}

export class PostSignupQueryDTO {
	@IsNotEmpty({ message: "type query is required" })
	type: UserRole;
}

export class GetVerifyEmailQueryDTO {
	@IsNotEmpty({ message: "v is required" })
	v: number;
}

export class GetVerifyEmailParamsDTO {
	@IsNotEmpty({ message: "email is required" })
	email: string;
}

export class GetResendVerifyEmailQueryDTO {
	@IsNotEmpty({ message: "e is required" })
	@IsEmail({}, { message: "e should be a valid email" })
	e: string;
}

export class PostSignupServiceProviderDetailsBodyDTO {
	isBarAssociationMember?: boolean;

	@IsNotEmpty({ message: "experience is required" })
	@IsNumber({}, { message: "experience must be a number" })
	experience: number;

	@IsNotEmpty({ message: "services is required" })
	services: string[];
}

export class PostSignupServiceProviderDetailsParamsDTO {
	@IsNotEmpty({ message: "email is required" })
	email: string;
}

export class PostSignupServiceProviderAttachmentsParamsDTO {
	@IsNotEmpty({ message: "email is required" })
	email: string;
}

export class PostAdminVerifyServiceProviderParamsDTO {
	@IsNotEmpty({ message: "email is required" })
	email: string;
}

export class PostLoginEmailPasswordBodyDTO {
	@IsNotEmpty({ message: "email is required" })
	@IsEmail({}, { message: "email should be a valid email" })
	email: string;

	@IsNotEmpty({ message: "password is required" })
	@IsString({ message: "password should be a valid string" })
	password: string;
}

export class PostSignupServiceProviderAttachmentsBodyDTO {
	@IsNotEmpty({ message: "files are required" })
	// NOTE: files will be in stringify json type and will contain title and type
	qualifications: string;
}

import { Injectable } from "@nestjs/common";
import { OTPReason } from "@prisma/client";
import prisma from "../../common/database/prisma";

@Injectable()
export class OtpService {
	async generateOtp(userId: string, reason: OTPReason) {
		const otp = Math.floor(100000 + Math.random() * 900000);

		// save otp to database
		return await prisma.otp.create({
			data: {
				otp,
				reason,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}
}

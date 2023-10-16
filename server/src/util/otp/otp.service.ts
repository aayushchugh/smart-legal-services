import { Injectable } from "@nestjs/common";
import { OTPReason, Otp } from "@prisma/client";
import prisma from "../../common/database/prisma";

@Injectable()
export class OtpService {
	/**
	 * Deletes OTP from database
	 *
	 * @private
	 * @param {string} otpId OTP's id
	 * @return {*}  {Promise<Otp>}
	 * @memberof OtpService
	 */
	private async deleteOtpFromDatabase(otpId: string): Promise<Otp> {
		return await prisma.otp.delete({
			where: { id: otpId },
		});
	}

	/**
	 * Generates OTP and saves it to database
	 *
	 * @param {string} userId User's id
	 * @param {OTPReason} reason Reason for which OTP is being generated
	 * @return {*}
	 * @memberof OtpService
	 */
	public async generateOtp(userId: string, reason: OTPReason): Promise<Otp> {
		const otp = Math.floor(100000 + Math.random() * 900000);

		// delete previous otps
		await prisma.otp.deleteMany({
			where: {
				userId,
				reason,
			},
		});

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

	/**
	 * Checks if OTP is correct or not
	 *
	 * @param {string} userId User's id
	 * @param {number} otp OTP to be verified
	 * @param {OTPReason} reason Reason for which OTP was generated
	 * @return {*}  {Promise<boolean>}
	 * @memberof OtpService
	 */
	public async verifyOtp(userId: string, otp: number, reason: OTPReason): Promise<boolean> {
		const otpRecord = await prisma.otp.findFirst({
			where: {
				otp,
				reason,
				userId,
			},
		});

		if (!otpRecord) {
			return false;
		}

		// check if otp is expired
		// NOTE: otp will expire after 5 minutes
		const otpCreatedAt = new Date(otpRecord.createdAt);
		const currentTime = new Date();
		const difference = currentTime.getTime() - otpCreatedAt.getTime();
		const differenceInMinutes = Math.round(difference / 60000);

		if (differenceInMinutes > 5) {
			// delete otp from database
			await this.deleteOtpFromDatabase(otpRecord.id);

			return false;
		}

		// delete otp from database
		await this.deleteOtpFromDatabase(otpRecord.id);

		return true;
	}
}

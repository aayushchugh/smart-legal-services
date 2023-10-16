import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
class AuthTokensUtil {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	private readonly accessTokenPrivateKey = this.configService.get<string>(
		"ACCESS_TOKEN_PRIVATE_KEY",
	);
	private readonly accessTokenPublicKey = this.configService.get<string>("ACCESS_TOKEN_PUBLIC_KEY");
	private readonly refreshTokenPrivateKey = this.configService.get<string>(
		"REFRESH_TOKEN_PRIVATE_KEY",
	);
	private readonly refreshTokenPublicKey = this.configService.get<string>(
		"REFRESH_TOKEN_PUBLIC_KEY",
	);

	/**
	 * Create access token
	 * @param userId Id of the user which will be signed in access token
	 */
	public async signAccessToken(userId: string): Promise<string> {
		return await this.jwtService.signAsync(
			{ userId },
			{
				privateKey: this.accessTokenPrivateKey,
				expiresIn: "15m",
			},
		);
	}

	/**
	 * Create refresh token
	 * @param sessionId Id of the session that will be signed in refresh token
	 */
	public async signRefreshToken(sessionId: string): Promise<string> {
		return await this.jwtService.signAsync(
			{ sessionId },
			{
				privateKey: this.refreshTokenPrivateKey,
				expiresIn: "7d",
			},
		);
	}

	/**
	 * Verify and decodes the access token
	 * @param token signed access token
	 */
	public async verifyAccessToken(token: string): Promise<{ userId: string }> {
		return await this.jwtService.verifyAsync(token, {
			publicKey: this.accessTokenPublicKey,
		});
	}

	/**
	 * Verify and decodes the refresh token
	 * @param token signed refresh token
	 */
	public async verifyRefreshToken(token: string): Promise<{ sessionId: string }> {
		return await this.jwtService.verifyAsync(token, {
			publicKey: this.refreshTokenPublicKey,
		});
	}
}

export default AuthTokensUtil;

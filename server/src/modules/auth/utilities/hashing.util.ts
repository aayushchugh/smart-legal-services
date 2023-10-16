import { Injectable } from "@nestjs/common";
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
class AuthHashingUtil {
	/**
	 * Generate hash for the payload
	 *
	 * @param {string} payload The payload to be hashed
	 * @return {Promise<string>} Returns the hashed payload
	 * @memberof HashingUtil
	 */
	public async generateHash(payload: string): Promise<string> {
		const salt = await genSalt(10);
		return await hash(payload, salt);
	}

	/**
	 * Compare the payload with the hashed payload
	 *
	 * @param {string} payload The payload to be compared
	 * @param {string} hashedPayload The hashed payload to be compared
	 * @return {Promise<boolean>} Returns true if the payload and hashed payload are same, else returns false
	 * @memberof HashingUtil
	 */
	public async compareHash(payload: string, hashedPayload: string): Promise<boolean> {
		return await compare(payload, hashedPayload);
	}
}

export default AuthHashingUtil;

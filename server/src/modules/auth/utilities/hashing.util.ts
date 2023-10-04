import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class HashingUtil {
  public async generateHash(payload: string) {
    const salt = await genSalt(10);
    return await hash(payload, salt);
  }
}

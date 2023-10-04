import { ConflictException, Injectable } from '@nestjs/common';
import { AuthSignupBodyDTO, AuthSignupQueryDTO } from './auth.dto';
import { Prisma } from '@prisma/client';
import { VerificationCodeUtil } from 'src/modules/auth/utilities/verification-code.util';
import { HashingUtil } from './utilities/hashing.util';
import prisma from 'src/common/database/prisma';
import { AuthEmailTemplateUtil } from './utilities/authEmailTemplate.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly verificationCodeUtil: VerificationCodeUtil,
    private readonly hashingUtility: HashingUtil,
    private readonly authEmailTemplateUtil: AuthEmailTemplateUtil,
  ) {}

  async authService(body: AuthSignupBodyDTO, query: AuthSignupQueryDTO) {
    try {
      // hash password
      const hashedPassword = await this.hashingUtility.generateHash(
        body.password,
      );

      // generate verification code
      const verificationCode =
        this.verificationCodeUtil.generateVerificationCode();

      // create user in database
      const createdUser = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          phone: body.phone,
          role: query.type === 'serviceProvider' ? 'serviceProvider' : 'user',
          isVerified: false,
          verificationCode,
          address: {
            city: body.address.city,
            state: body.address.state,
            pinCode: body.address.pinCode,
            addressLine1: body.address.addressLine1,
            addressLine2: body.address.addressLine2
              ? body.address.addressLine2
              : null,
          },
        },
      });

      // send code to email
      await this.authEmailTemplateUtil.sendVerificationEmail(createdUser);

      return {
        statusCode: 201,
        message: 'User created successfully',
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Account with this email or username already exists',
        );
      }

      console.log(err);
      throw new Error(err);
    }
  }
}

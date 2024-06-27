import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../model/user.model";
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 

@Injectable()
export class UserService{

    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async register(request: RegisterUserRequest) : Promise<UserResponse> {
        this.logger.info(`Register new user ${JSON.stringify(request)}`);
        const registerRequest = this.validationService.validate (
            UserValidation.REGISTER,
            request
        );

        const sameEmailCount = await this.prismaService.user.count({
            where: {
                email: registerRequest.email,
            },
        })

        if (sameEmailCount != 0) {
            throw new HttpException('Username already exists', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await this.prismaService.user.create({
            data: {
                ...registerRequest,
                role: 'Customer',
            },
        })

        return {
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role
        };
    }

    async login(request: LoginUserRequest) : Promise<UserResponse> {
        this.logger.info(`UserService.login(${JSON.stringify(request)})`)
        const loginRequest = this.validationService.validate (
            UserValidation.LOGIN,
            request
        )

        const user = await this.prismaService.user.findUnique({
            where: {
                email: loginRequest.email
            }
        })

        if(!user) {
            throw new HttpException('Username or password is invalid', 401);
        }
        
        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        
        if(!isPasswordValid) {
            throw new HttpException('Username or password is invalid', 401);
        }

        await this.prismaService.user.update({
            where: {
                email: loginRequest.email
            },
            data: {
                token: uuid()
            }
        })

        return {
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token: user.token
        }
    }

}
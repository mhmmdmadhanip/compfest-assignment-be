import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 
import { User } from ".prisma/client";
import { Role } from "@prisma/client";

@Injectable()
export class UserService{

    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async register(request: RegisterUserRequest) : Promise<UserResponse> {
        this.logger.debug(`Register new user ${JSON.stringify(request)}`);
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
            throw new HttpException('Email already exists', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await this.prismaService.user.create({
            data: {
                ...registerRequest,
                role: Role.Customer,
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
        this.logger.debug(`UserService.login(${JSON.stringify(request)})`)
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

    async getUser(user: User): Promise<UserResponse> {
        return {
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role,
        }
    }

    async updateUser(user:User, request: UpdateUserRequest): Promise<UserResponse>  {
        this.logger.debug(`UserService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`)

        const updateRequest: UpdateUserRequest = this.validationService.validate(UserValidation.UPDATE, request);

        if(updateRequest.fullName) {
            user.fullName = updateRequest.fullName;
        }

        if(updateRequest.phoneNumber) {
            user.phoneNumber = updateRequest.phoneNumber;
        }

        if(updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await this.prismaService.user.update({
            where: {
                email: user.email
            },
            data: user
        })

        return {
            email: result.email,
            fullName: result.fullName,
            phoneNumber: result.phoneNumber,
            role: result.role,
        }
    }

    async logout(user:User): Promise<UserResponse> {
        const result = await this.prismaService.user.update({
            where: {
                email: user.email
            },
            data: {
                token: null
            }
        })

        return {
            email: result.email,
            fullName: result.fullName,
            phoneNumber: result.phoneNumber,
            role: result.role,
        }
    }

    async deleteAllUsers() {
        await this.prismaService.user.deleteMany({});
    }
}
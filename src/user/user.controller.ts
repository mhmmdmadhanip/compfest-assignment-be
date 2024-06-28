import { Body, Controller, Delete, Get, HttpCode, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { WebResponse } from "../model/web.model";
import { User } from ".prisma/client";
import { Auth } from "../common/auth.decorator";


@Controller('/api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async register(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>>{
        const result = await this.userService.register(request);
        return {
            data:result
        }
    }
    
    @Post('/login')
    @HttpCode(200)
    async login(@Body() request: LoginUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);
        return {
            data: result
        }
    }

    @Get('/current')
    @HttpCode(200)
    async getUser(@Auth() user: User): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.getUser(user);
        return {
            data: result
        }
    }

    @Patch('/current')
    @HttpCode(200)
    async updateUser(@Auth() user: User, @Body() request: UpdateUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.updateUser(user, request);
        return {
            data: result
        }
    }

    @Delete('/current')
    @HttpCode(200)
    async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
        const result = await this.userService.logout(user);
        return {
            data: true
        }
    }

    @Delete()
    async deleteAll() {
        await this.userService.deleteAllUsers();
    }
}
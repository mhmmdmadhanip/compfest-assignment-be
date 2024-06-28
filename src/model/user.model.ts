import { Role } from "@prisma/client";

export class RegisterUserRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: Role;
    token?: string;
}

export class LoginUserRequest {
    email: string;
    password: string;
}

export class UpdateUserRequest {
    fullName?: string;
    phoneNumber?: string;
    password?: string;
}

export class UserResponse {
    email: string;
    fullName: string;
    phoneNumber: string;
    role: Role;
    token?: string;
}

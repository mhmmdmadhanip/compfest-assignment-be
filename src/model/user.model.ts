
export class RegisterUserRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    token?: string;
}

export class LoginUserRequest {
    email: string;
    password: string;
}

export class UserResponse {
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    token?: string;
}
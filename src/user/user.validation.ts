import { z, ZodType } from "zod";


export class UserValidation {
    static readonly REGISTER : ZodType = z.object({
        email: z.string().min(1).max(50),
        password: z.string().min(1).max(50),
        fullName: z.string().min(1).max(100),
        phoneNumber: z.string().min(1).max(15),
    })
}
import { z, ZodType } from "zod";


export class UserValidation {
    static readonly REGISTER : ZodType = z.object({
        email: z.string().min(1).max(50),
        password: z.string().min(1).max(20),
        fullName: z.string().min(1).max(100),
        phoneNumber: z.string().min(1).max(15),
    })

    static readonly LOGIN : ZodType = z.object({
        email: z.string().min(1).max(50),
        password: z.string().min(1).max(20)
    })

    static readonly UPDATE : ZodType = z.object({
        password: z.string().min(1).max(20).optional(),
        fullName: z.string().min(1).max(100).optional(),
        phoneNumber: z.string().min(1).max(15).optional()
    })
}
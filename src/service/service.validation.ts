import { z, ZodType } from "zod";

export class ServiceValidation{
    static readonly CREATE: ZodType = z.object({
        serviceName: z.string().min(1).max(50),
        duration: z.number().min(1).max(60),
    })
    static readonly UPDATE: ZodType = z.object({
        serviceName: z.string().min(1).max(50).optional(),
        duration: z.number().min(1).max(60).optional(),
    })
}
import { z, ZodType } from "zod";
import { Review, Reservation, BranchService } from '@prisma/client';

export class ServiceValidation{
    static readonly CREATE: ZodType = z.object({
        serviceName: z.string().min(1).max(50),
        duration: z.number().min(1).max(60),
    })
}
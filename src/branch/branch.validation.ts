import { z, ZodType } from "zod";


export class ValidationBranch{
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(50),
        locationName: z.string().min(1).max(100),
        openTime: z.string().min(5).max(5),
        closeTime: z.string().min(5).max(5),
    }).refine(data => data.openTime !== data.closeTime, {
        message: "Open time and close time cannot be the same",
    });
}
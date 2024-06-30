import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { Logger } from "winston";
import { ValidationBranch } from "./branch.validation";
import { BranchResponses, CreateBranchRequest } from "../model/branch.model";
import { Role, User } from "@prisma/client";
import { ValidationService } from "../common/validation.service";

@Injectable()
export class BranchService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async create (user: User, request: CreateBranchRequest): Promise<BranchResponses> {
        const isAdmin = user.role === Role.Admin;
        if (!isAdmin) {
            throw new HttpException('Forbidden', 403);
        }
    
        const createRequest: CreateBranchRequest = this.validationService.validate(
            ValidationBranch.CREATE,
            request
        );

        const branch = await this.prismaService.branch.create({
            data: createRequest
        })

        return {
            name: branch.name,
            locationName: branch.locationName,
            openTime: branch.openTime,
            closeTime: branch.closeTime
        }
    }
}
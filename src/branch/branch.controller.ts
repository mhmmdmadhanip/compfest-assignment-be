import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { BranchService } from "./branch.service";
import { BranchResponses, CreateBranchRequest } from "../model/branch.model";
import { WebResponse } from "../model/web.model";

@Controller('/api/branches')
export class BranchController {
    constructor(private branchService: BranchService) {}

    @Post()
    async create(
        @Auth() user:User,
        @Body() request: CreateBranchRequest
    ): Promise <WebResponse<BranchResponses>> {
        const result = await this.branchService.create(user, request);
        return {
            data: result
        }
    }
}
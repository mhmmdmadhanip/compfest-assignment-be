import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { Auth } from "../common/auth.decorator";
import { CreateServiceRequest, ServiceResponses } from "../model/service.model";
import { WebResponse } from "../model/web.model";
import { User } from "@prisma/client";

@Controller('/api/services')
export class ServiceController {
    constructor(private service: ServiceService) {}

    @Post()
    async create(
        @Auth() user:User,
        @Body() request: CreateServiceRequest
    ): Promise <WebResponse<ServiceResponses>> {
        const result = await this.service.create(user, request);
        return {
            data: result
        }
    }

    @Get()
    async getAllServices(): Promise <WebResponse<ServiceResponses[]>> {
        const result = await this.service.getAllServices();
        return {
            data: result
        }
    }

    @Get(':serviceName')
    async getService(@Param('serviceName') serviceName: string): Promise <WebResponse<ServiceResponses>> {
        const result = await this.service.getService(serviceName);
        return {
            data: result
        }
    }
}
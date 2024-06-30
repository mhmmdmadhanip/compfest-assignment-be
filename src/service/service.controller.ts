import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
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

    @Get('/all')
    @HttpCode(200)
    async getAllServices(@Auth() user:User): Promise <WebResponse<ServiceResponses[]>> {
        const result = await this.service.getAllServices(user);
        return {
            data: result
        }
    }

    @Get('/:id')
    @HttpCode(200)
    async getService(@Param('id', ParseIntPipe) id: number): Promise <WebResponse<ServiceResponses>> {
        const result = await this.service.getService(id);
        return {
            data: result
        }
    }

    @Patch('/:id')
    @HttpCode(200)
    async updateService(@Auth() user:User, @Body() request: CreateServiceRequest, @Param('id', ParseIntPipe) id: number): Promise <WebResponse<ServiceResponses>> {
        const result = await this.service.updateService(user, id, request);
        return {
            data:result
        }
    }
}
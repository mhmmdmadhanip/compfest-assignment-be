import { User } from ".prisma/client";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { CreateServiceRequest, ServiceResponses, UpdateServiceRequest } from "../model/service.model";
import { ServiceValidation } from "./service.validation"
import { Role, Service } from "@prisma/client";
import * as request from 'supertest';

@Injectable()
export class ServiceService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async create(user: User, request: CreateServiceRequest): Promise<ServiceResponses> {
        const isAdmin = user.role === Role.Admin;
        if (!isAdmin) {
            throw new HttpException('Forbidden', 403);
        }
    
        this.logger.debug(`Validating create service request: ${JSON.stringify(request)}`);
        const createRequest: CreateServiceRequest = this.validationService.validate(
            ServiceValidation.CREATE,
            request
        );
    
        const sameServiceNameCount = await this.prismaService.service.count({
            where: {
                serviceName: createRequest.serviceName,
            },
        });
    
        if (sameServiceNameCount != 0) {
            throw new HttpException('Service Name already exists', 400);
        }
    
        const service = await this.prismaService.service.create({
            data: {
                ...createRequest,
            }
        });
    
        this.logger.debug(`Service created successfully: ${JSON.stringify(service)}`);
        return {
            serviceName: service.serviceName,
            duration: service.duration,
        };
    }
    
    async getAllServices(user: User): Promise<ServiceResponses[]> {
        if(user.role !== Role.Admin) {
            throw new HttpException('Forbidden', 403);
        }
        return this.prismaService.service.findMany();
    }

    async getService(id:number): Promise<ServiceResponses> {
        const result = await this.prismaService.service.findUnique({
            where:{
                serviceID: id
            }
        })

        if(!result) {
            throw new HttpException('Service Not Found', 404)
        }

        return {
            serviceName: result.serviceName,
            duration: result.duration,
        }
    }

    async updateService(user:User, id:number, request:UpdateServiceRequest) {
        const isAdmin = user.role === Role.Admin;
        if (!isAdmin) {
            throw new HttpException('Forbidden', 403);
        }

        const updateRequest: UpdateServiceRequest = this.validationService.validate(
            ServiceValidation.UPDATE,
            request
        );

        const service = await this.prismaService.service.findUnique({
            where: {
                serviceID: id
            }
        })

        if(updateRequest.serviceName) {
            const sameServiceNameCount = await this.prismaService.service.count({
                where: {
                    serviceName: updateRequest.serviceName,
                },
            });
        
            if (sameServiceNameCount !== 0) {
                throw new HttpException('Failed to Update Name', 400)
            }
            service.serviceName = updateRequest.serviceName;
        }

        if(updateRequest.duration) {
            service.duration = updateRequest.duration;
        }

        const result = await this.prismaService.service.update({
            where: {
                serviceID: id
            },
            data: service
        })

        return {
            serviceName: result.serviceName,
            duration: result.duration,
        };
    }
}
import { User } from ".prisma/client";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { CreateServiceRequest, ServiceResponses } from "../model/service.model";
import { ServiceValidation } from "./service.validation"
import { Role } from "@prisma/client";

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
    
        this.logger.debug(`Checking for existing service with name: ${createRequest.serviceName}`);
        const sameServiceNameCount = await this.prismaService.service.count({
            where: {
                serviceName: createRequest.serviceName,
            },
        });
    
        this.logger.debug(`Found ${sameServiceNameCount} services with the same name.`);
        if (sameServiceNameCount != 0) {
            throw new HttpException('Service Name already exists', 400);
        }
    
        this.logger.debug(`Creating new service: ${JSON.stringify(createRequest)}`);
        const service = await this.prismaService.service.create({
            data: {
                ...createRequest,
                branches: { create: []}
            }
        });
    
        this.logger.debug(`Service created successfully: ${JSON.stringify(service)}`);
        return {
            serviceName: service.serviceName,
            duration: service.duration,
        };
    }
    
    async getAllServices(): Promise<ServiceResponses[]> {
        return this.prismaService.service.findMany();
    }

    async getService(serviceName:string): Promise<ServiceResponses> {
        const result = await this.prismaService.service.findUnique({
            where:{
                serviceName: serviceName
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
}
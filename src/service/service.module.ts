import { Module } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { PrismaService } from "../common/prisma.service";
import { ServiceController } from "./service.controller";


@Module({
    providers: [ServiceService, PrismaService],
    controllers: [ServiceController]
})

export class ServiceModule{}
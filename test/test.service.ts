import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { User } from ".prisma/client";
import { Role } from "@prisma/client";


@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                email: 'mhmmdmadhani22@gmail.com'
            }
        })
    }

    async checkToken(): Promise<User>{
        return this.prismaService.user.findUnique({
            where: {
                email: 'mhmmdmadhani22@gmail.com'
            }
        })
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                email: 'mhmmdmadhani22@gmail.com',
                password: await bcrypt.hash('madans',10),
                fullName: 'Muhammad Madhani Putra',
                phoneNumber: '085155436530',
                role: Role.Customer,
                token: 'user'
            }
        })
    }

    async createAdmin() {
        await this.prismaService.user.update({
            where: {
                email: 'mhmmdmadhani22@gmail.com'
            },
            data: {
                role: Role.Admin,
            }
        })
    }

    async deleteAdmin() {
        await this.prismaService.user.update({
            where: {
                email: 'mhmmdmadhani22@gmail.com'
            },
            data: {
                role: Role.Customer,
            }
        })
    }

    async createService() {
        await this.prismaService.service.create({
            data: {
                serviceName: 'Test Service',
                duration: 40,
            }
        })
    }

    async deleteService() {
        await this.prismaService.service.deleteMany({
            where: {
                serviceName: 'Test Service'
            }
        })
    }
}
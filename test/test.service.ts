import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';


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

    async createUser() {
        await this.prismaService.user.create({
            data: {
                email: 'mhmmdmadhani22@gmail.com',
                password: await bcrypt.hash('madans',10),
                fullName: 'Muhammad Madhani Putra',
                phoneNumber: '085155436530',
                role: 'Customer',
                token: 'user'
            }
        })
    }
}
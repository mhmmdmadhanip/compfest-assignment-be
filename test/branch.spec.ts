import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  
  describe("POST /api/branches", () => {

    beforeEach(async () => {
        await testService.deleteUser();
        await testService.createUser();
    })

    it("should be rejected if token is invalid", async () => {
        const response = await request(app.getHttpServer())
          .post('/api/branches')
          .set('Authorization', 'wrong');
  
          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
      })

    it("should be rejected if user is not admin", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/branches')
        .set('Authorization', 'user')
        .send({
            name: 'Salon and Spa',
            locationName: 'Jl. Seroja No.1',
            openTime: '09.00',
            closeTime: '21.00'
        })

        expect(response.status).toBe(403);
        expect(response.body.errors).toBeDefined();
    })

    it("should be rejected if request is invalid", async () => {
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
          .post('/api/branches')
          .set('Authorization', 'user')
          .send({
            name: '',
            locationName: '',
            openTime: '',
            closeTime: ''
          });
  
          expect(response.status).toBe(400);
          expect(response.body.errors).toBeDefined();
      })

      it("should be able to create", async () => {
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
          .post('/api/branches')
          .set('Authorization', 'user')
          .send({
            name: 'Salon and Spa',
            locationName: 'Jl. Seroja No.1',
            openTime: '09.00',
            closeTime: '21.00'
          });
  
          expect(response.status).toBe(201);
          expect(response.body.data.name).toBe('Salon and Spa');
          expect(response.body.data.locationName).toBe('Jl. Seroja No.1');
          expect(response.body.data.openTime).toBe('09.00');
          expect(response.body.data.closeTime).toBe('21.00');
      })
  })

});
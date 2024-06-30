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

  
  describe("POST /api/services", () => {

    beforeEach(async () => {
        await testService.deleteService();
        await testService.deleteUser();
        await testService.createUser();
    })

    it("should be rejected if token is invalid", async () => {
        const response = await request(app.getHttpServer())
          .post('/api/services')
          .set('Authorization', 'wrong');
  
          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
      })

    it("should be rejected if user is not admin", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/services')
        .set('Authorization', 'user')
        .send({
          serviceName: 'Test Services',
          duration: 40,
        })

        expect(response.status).toBe(403);
        expect(response.body.errors).toBeDefined();
    })

    it("should be rejected if request is invalid", async () => {
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
          .post('/api/services')
          .set('Authorization', 'user')
          .send({
            serviceName: '',
            duration: 0,
          });
  
          expect(response.status).toBe(400);
          expect(response.body.errors).toBeDefined();
      })

      it("should be able to create", async () => {
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
          .post('/api/services')
          .set('Authorization', 'user')
          .send({
            serviceName: 'Test Service',
            duration: 40,
          });
  
          expect(response.status).toBe(201);
          expect(response.body.data.serviceName).toBe('Test Service');
          expect(response.body.data.duration).toBe(40);
      })

      it("should be rejected if serviceName already exists", async () => {
        await testService.createAdmin();
        await testService.createService();
        
        const response = await request(app.getHttpServer())
          .post('/api/services')
          .set('Authorization', 'user')
          .send({
            serviceName: 'Test Service',
            duration: 40,
          });
  
          expect(response.status).toBe(400);
          expect(response.body.errors).toBeDefined();
      })
  })

  describe("GET /api/services/*", () => {

    beforeEach(async () => {
        await testService.deleteService();
        await testService.deleteUser();
        await testService.createUser();
        await testService.createService();
    })

    it("should be rejected if token is invalid", async () => {
        const response = await request(app.getHttpServer())
          .get('/api/services/all')
          .set('Authorization', 'wrong');
  
          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
      })

    it("should be rejected if user is not admin", async () => {
        const response = await request(app.getHttpServer())
        .get(`/api/services/all`)
        .set('Authorization', 'user')

        expect(response.status).toBe(403);
        expect(response.body.errors).toBeDefined();
      })

      it("should be able to get all user", async () => {
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
        .get(`/api/services/all`)
        .set('Authorization', 'user')

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
      })


      it("shouldn't be able to get user", async () => {
        const service = await testService.getService();
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
        .get(`/api/services/${service.serviceID + 10}`)

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
      })

      it("should be able to get user", async () => {
        const service = await testService.getService();
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
        .get(`/api/services/${service.serviceID}`)

        expect(response.status).toBe(200);
        expect(response.body.data.serviceName).toBe('Test Service');
      })

  })
  
  describe("PATCH /api/services/:serviceID", () => {

    beforeEach(async () => {
        await testService.deleteService();
        await testService.deleteUser();
        await testService.createUser();
        await testService.createService();
    })

    it("should be rejected if token is invalid", async () => {
        const service = await testService.getService();
        const response = await request(app.getHttpServer())
        .patch(`/api/services/${service.serviceID}`)
          .set('Authorization', 'wrong');
  
          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
      })

    it("should be rejected if user is not admin", async () => {
        const service = await testService.getService();
        const response = await request(app.getHttpServer())
        .patch(`/api/services/${service.serviceID}`)
        .set('Authorization', 'user')
        .send({
            serviceName: 'Test Services',
            duration: 40,
        })

        expect(response.status).toBe(403);
        expect(response.body.errors).toBeDefined();
      })

    it("should be rejected if request is invalid", async () => {
        const service = await testService.getService();
        await testService.createAdmin();
        const response = await request(app.getHttpServer())
        .patch(`/api/services/${service.serviceID}`)
        .set('Authorization', 'user')
        .send({
            serviceName: '',
            duration: 0,
        });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it("should be able to update service name", async () => {
        await testService.createAdmin();
        const service = await testService.getService();
        const response = await request(app.getHttpServer())
        .patch(`/api/services/${service.serviceID}`)
        .set('Authorization', 'user')
            .send({
            serviceName: 'Updated',
            });

        expect(response.status).toBe(200);
        expect(response.body.data.serviceName).toBe('Updated');
    })

    it("should be able to update duration", async () => {
        await testService.createAdmin();
        const service = await testService.getService();

        const response = await request(app.getHttpServer())
        .patch(`/api/services/${service.serviceID}`)
        .set('Authorization', 'user')
        .send({
          duration: 32,
        });

        expect(response.status).toBe(200);
        expect(response.body.data.duration).toBe(32);
    })

    it("shouldn't be able to update service name", async () => {
        await testService.createAdmin();
        const service = await testService.getService();
        const response = await request(app.getHttpServer())
        .patch(`/api/services/${service.serviceID}`)
        .set('Authorization', 'user')
        .send({
          serviceName: 'Unique Service',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })
  })

});
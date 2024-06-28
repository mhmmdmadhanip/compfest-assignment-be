import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

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

        const loggerSpy = jest.spyOn(logger, 'debug');
        
        const response = await request(app.getHttpServer())
          .post('/api/services')
          .set('Authorization', 'user')
          .send({
            serviceName: 'Test Service',
            duration: 40,
          });
  
          expect(response.status).toBe(400);
          expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Validating create service request'));
          expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Checking for existing service with name'));
          expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Found 1 services with the same name.'));
          expect(response.body.errors).toBeDefined();
      })
  })

});

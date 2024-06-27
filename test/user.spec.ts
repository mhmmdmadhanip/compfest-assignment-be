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

  
  describe("POST /api/users", () => {

    beforeEach(async () => {
      await testService.deleteUser();
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: '',
          password: '',
          fullName: '',
          phoneNumber: '',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it("should be able to register", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'mhmmdmadhani22@gmail.com',
          password: 'madans',
          fullName: 'Muhammad Madhani Putra',
          phoneNumber: '085155436530',
        });

        expect(response.status).toBe(201);
        expect(response.body.data.email).toBe('mhmmdmadhani22@gmail.com');
        expect(response.body.data.fullName).toBe('Muhammad Madhani Putra');
        expect(response.body.data.phoneNumber).toBe('085155436530');
        expect(response.body.data.role).toBe('Customer');
    })

    it("should be rejected if email already exists", async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'mhmmdmadhani22@gmail.com',
          password: 'madans',
          fullName: 'Muhammad Madhani Putra',
          phoneNumber: '085155436530',
        });

        logger.info(response.body)

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })
  })

  describe("POST /api/users/login", () => {

    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: '',
          password: '',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it("should be able to login", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: 'mhmmdmadhani22@gmail.com',
          password: 'madans',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe('mhmmdmadhani22@gmail.com');
        expect(response.body.data.fullName).toBe('Muhammad Madhani Putra');
        expect(response.body.data.phoneNumber).toBe('085155436530');
        expect(response.body.data.role).toBe('Customer');
        expect(response.body.data.token).toBeDefined();
    })
  })

  describe("GET /api/users/current", () => {

    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong');

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

    it("should be able to get user", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'user')

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe('mhmmdmadhani22@gmail.com');
        expect(response.body.data.fullName).toBe('Muhammad Madhani Putra');
        expect(response.body.data.phoneNumber).toBe('085155436530');
        expect(response.body.data.role).toBe('Customer');

    })
  })

  describe("PATCH /api/users/current", () => {

    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'user')
        .send({
          password: '',
          fullName: '',
          phoneNumber: '',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it("should be able to update name", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'user')
        .send({
          fullName: 'Madans',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe('mhmmdmadhani22@gmail.com');
        expect(response.body.data.fullName).toBe('Madans');
        expect(response.body.data.phoneNumber).toBe('085155436530');
        expect(response.body.data.role).toBe('Customer');
    })

    it("should be able to update phone number", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'user')
        .send({
          phoneNumber: '081219143444',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe('mhmmdmadhani22@gmail.com');
        expect(response.body.data.fullName).toBe('Muhammad Madhani Putra');
        expect(response.body.data.phoneNumber).toBe('081219143444');
        expect(response.body.data.role).toBe('Customer');
    })

    it("should be able to update password", async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'user')
        .send({
          password: 'madans22',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe('mhmmdmadhani22@gmail.com');
        expect(response.body.data.fullName).toBe('Muhammad Madhani Putra');
        expect(response.body.data.phoneNumber).toBe('085155436530');
        expect(response.body.data.role).toBe('Customer');

        response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: 'mhmmdmadhani22@gmail.com',
          password: 'madans22',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
    })
  })

  describe("DELETE /api/users/current", () => {

    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'wrong');

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

    it("should be able to logout", async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'user')

        expect(response.status).toBe(200);
        expect(response.body.data).toBe(true);

    })
  })

});

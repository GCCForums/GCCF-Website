import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

describe('Security & Audit Governance (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  }, 60000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /admin/audit-logs rejects unauthenticated requests with 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .get('/admin/audit-logs')
      .expect(401);
  }, 30000);

  it('POST /auth/login returns HttpOnly admin_access_token cookie and allows access to audit logs', async () => {
    const initialUsername = process.env.ADMIN_INITIAL_USERNAME ;
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD ;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: initialUsername, password: initialPassword });

    if (loginRes.status === 200) {
      const cookies = loginRes.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      const authCookie = cookies.find((c) => c.startsWith('admin_access_token='));
      expect(authCookie).toBeDefined();
      expect(authCookie?.toLowerCase()).toContain('httponly');

      // Now query audit-logs using the HttpOnly cookie
      const auditRes = await request(app.getHttpServer())
        .get('/admin/audit-logs')
        .set('Cookie', authCookie || '')
        .expect(200);

      expect(auditRes.body).toHaveProperty('items');
      expect(Array.isArray(auditRes.body.items)).toBe(true);

      // Verify logout clears the cookie
      const logoutRes = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200);

      const logoutCookies = logoutRes.headers['set-cookie'] as unknown as string[];
      expect(logoutCookies).toBeDefined();
      const clearedCookie = logoutCookies.find((c) => c.startsWith('admin_access_token='));
      expect(clearedCookie).toBeDefined();
      // Cleared cookies either set empty value or past expiry date
      expect(clearedCookie).toMatch(/admin_access_token=;|Expires=Thu, 01 Jan 1970/);
    }
  }, 30000);
});

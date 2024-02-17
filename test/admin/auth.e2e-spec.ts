import request from 'supertest';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  ADMIN_USERNAME,
} from '../utils/constants';

describe('Auth', () => {
  const app = APP_URL;

  describe('Admin', () => {
    it('should successfully login via /api/v1/auth/email/login (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/login')
        .send({
          email: ADMIN_EMAIL,
          username: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined();
          expect(body.user.email).toBeDefined();
          expect(body.user.username).toBeDefined();
          expect(body.user.role).toBeDefined();
        });
    });
  });
});

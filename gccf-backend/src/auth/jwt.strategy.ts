import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminService } from '../admin/admin.service';

const cookieOrHeaderExtractor = (req: Request): string | null => {
  if (req && req.cookies && req.cookies['admin_access_token']) {
    return req.cookies['admin_access_token'];
  }
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private adminService: AdminService,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret && process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable must be set in production!');
    }

    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret || 'gccf-dev-fallback-secret-never-use-in-prod',
    });
  }

  async validate(payload: { sub: string; username: string }) {
    const admin = await this.adminService.findOne(payload.username);
    if (!admin) {
      throw new UnauthorizedException();
    }
    if (admin.isActive === false) {
      throw new UnauthorizedException('Account has been deactivated.');
    }
    return {
      id: payload.sub,
      username: payload.username,
      role: admin.role,
      permissions: admin.permissions || [],
    };
  }
}

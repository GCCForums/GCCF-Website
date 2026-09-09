import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'gccf-secret-key-change-in-production',
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

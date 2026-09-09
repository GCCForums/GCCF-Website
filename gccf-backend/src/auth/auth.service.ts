import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const admin = await this.adminService.findOne(username);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (admin.isActive === false) {
      throw new UnauthorizedException('Account has been deactivated. Please contact Super Admin.');
    }

    const isPasswordValid = await this.adminService.validatePassword(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id.toString(),
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions || [],
        isActive: admin.isActive,
      },
    };
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminRepository = this.dataSource.getRepository(Admin);

    const existingAdmin = await adminRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('gccf123', 10);
      const admin = adminRepository.create({
        username: 'admin',
        password: hashedPassword,
        role: 'super_admin',
        permissions: ['all'],
        isActive: true,
      });
      await adminRepository.save(admin);
      console.log('Super Admin user created with default credentials');
    } else if (existingAdmin.role !== 'super_admin') {
      existingAdmin.role = 'super_admin';
      existingAdmin.permissions = ['all'];
      existingAdmin.isActive = true;
      await adminRepository.save(existingAdmin);
      console.log('Existing admin upgraded to super_admin');
    }
  }
}

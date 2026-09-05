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
    
    const existingAdmin = await adminRepository.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('gccf123', 10);
      const admin = adminRepository.create({
        username: 'admin',
        password: hashedPassword,
      });
      await adminRepository.save(admin);
      console.log('Admin user created with default credentials');
    }
  }
}

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminRepository = this.dataSource.getRepository(Admin);
    const initialUsername = process.env.ADMIN_INITIAL_USERNAME;
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

    const adminCount = await adminRepository.count();

    if (!initialUsername || !initialPassword) {
      if (adminCount === 0) {
        this.logger.warn(
          'SECURITY NOTICE: No admin accounts exist in the database and ADMIN_INITIAL_USERNAME / ADMIN_INITIAL_PASSWORD are not configured in environment variables. Define them in your .env file to create the initial admin.',
        );
      }
      return;
    }

    const existingAdmin = await adminRepository.findOne({
      where: { username: initialUsername },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(initialPassword, 10);
      const admin = adminRepository.create({
        username: initialUsername,
        password: hashedPassword,
        role: 'super_admin',
        permissions: ['all'],
        isActive: true,
      });
      await adminRepository.save(admin);
      this.logger.log(`Super Admin user '${initialUsername}' initialized successfully.`);
    } else if (existingAdmin.role !== 'super_admin') {
      existingAdmin.role = 'super_admin';
      existingAdmin.permissions = ['all'];
      existingAdmin.isActive = true;
      await adminRepository.save(existingAdmin);
      this.logger.log(`Existing admin '${initialUsername}' upgraded to super_admin.`);
    }
  }
}

import { DataSource } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(dataSource: DataSource) {
  const adminRepository = dataSource.getRepository(Admin);
  
  const existingAdmin = await adminRepository.findOne({ where: { username: 'admin' } });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('gccf123', 10);
    const admin = adminRepository.create({
      username: 'admin',
      password: hashedPassword,
    });
    await adminRepository.save(admin);
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

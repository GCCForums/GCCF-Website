import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findOne(username: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { username } });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async create(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      username,
      password: hashedPassword,
      role: 'admin',
      permissions: ['dashboard'],
      isActive: true,
    });
    return this.adminRepository.save(admin);
  }

  async findAll(): Promise<Omit<Admin, 'password'>[]> {
    const admins = await this.adminRepository.find({
      order: { createdAt: 'ASC' },
    });
    return admins.map(({ password, ...rest }) => rest as Omit<Admin, 'password'>);
  }

  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminUserDto): Promise<Omit<Admin, 'password'>> {
    const existing = await this.adminRepository.findOne({
      where: { username: createAdminDto.username },
    });
    if (existing) {
      throw new ConflictException(`Username '${createAdminDto.username}' already exists`);
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const admin = this.adminRepository.create({
      username: createAdminDto.username,
      password: hashedPassword,
      role: createAdminDto.role || 'admin',
      permissions: createAdminDto.permissions || ['dashboard'],
      isActive: createAdminDto.isActive !== undefined ? createAdminDto.isActive : true,
    });

    const saved = await this.adminRepository.save(admin);
    const { password, ...result } = saved;
    return result as Omit<Admin, 'password'>;
  }

  async updateAdmin(
    id: number,
    updateAdminDto: UpdateAdminUserDto,
  ): Promise<Omit<Admin, 'password'>> {
    const admin = await this.findById(id);

    if (updateAdminDto.password) {
      admin.password = await bcrypt.hash(updateAdminDto.password, 10);
    }
    if (updateAdminDto.role) {
      admin.role = updateAdminDto.role;
    }
    if (updateAdminDto.permissions !== undefined) {
      admin.permissions = updateAdminDto.permissions;
    }
    if (updateAdminDto.isActive !== undefined) {
      admin.isActive = updateAdminDto.isActive;
    }

    const saved = await this.adminRepository.save(admin);
    const { password, ...result } = saved;
    return result as Omit<Admin, 'password'>;
  }

  async deleteAdmin(id: number): Promise<void> {
    const admin = await this.findById(id);
    if (admin.username === 'admin' && admin.role === 'super_admin') {
      throw new BadRequestException('Cannot delete the primary super admin account');
    }
    await this.adminRepository.remove(admin);
  }
}

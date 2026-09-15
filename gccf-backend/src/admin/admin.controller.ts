import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
@Controller('admin/users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Post()
  create(@Body() createAdminDto: CreateAdminUserDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminUserDto,
  ) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteAdmin(id);
    return { success: true, message: 'Admin deleted successfully' };
  }
}

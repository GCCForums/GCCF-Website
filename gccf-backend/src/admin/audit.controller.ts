import {
  Controller,
  Get,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuditService } from './audit.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin') // Strictly restricted: standard admins receive 403 Forbidden
@Controller('admin/audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
    @Query('entity') entity?: string,
    @Query('actor') actor?: string,
  ) {
    return this.auditService.findAll(page, limit, entity, actor);
  }

  @Delete('prune')
  async pruneLogs() {
    const deletedCount = await this.auditService.pruneOldLogs();
    return {
      success: true,
      deletedCount,
      message: `Pruned ${deletedCount} audit log entries older than 30 days`,
    };
  }
}

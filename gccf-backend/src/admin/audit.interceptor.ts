import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl || req.url || '';

    // Only audit mutating methods
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    if (!isMutation) {
      return next.handle();
    }

    // Don't audit standard public login endpoint attempts as internal mutation logs
    if (url.includes('/auth/login')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          const user = req.user;
          if (!user) return; // Unauthenticated requests (e.g., public submissions) are not admin mutations

          // Sanitize body to avoid storing passwords or raw secrets
          let sanitizedPayload = null;
          if (req.body && typeof req.body === 'object') {
            const { password, token, secret, ...safeBody } = req.body;
            sanitizedPayload = safeBody;
          }

          const pathSegments = url.split('?')[0].split('/').filter(Boolean);
          const targetEntity = pathSegments[0] === 'admin' ? (pathSegments[1] || 'admin') : (pathSegments[0] || 'unknown');
          const targetId = req.params?.id || (responseData && responseData.id ? String(responseData.id) : null);

          await this.auditService.record({
            actorId: String(user.id || user.sub || 'unknown'),
            actorUsername: user.username || 'unknown',
            actorRole: user.role || 'unknown',
            action: `${method} ${url.split('?')[0]}`,
            targetEntity,
            targetId: targetId ? String(targetId) : null,
            changes: sanitizedPayload,
            ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip || req.socket?.remoteAddress || null,
            userAgent: req.headers['user-agent'] || null,
          });
        } catch (err) {
          this.logger.error(`Audit logging failed: ${err.message}`, err.stack);
        }
      }),
    );
  }
}

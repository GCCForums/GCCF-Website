import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { NewsModule } from './news/news.module';
import { GalleryModule } from './gallery/gallery.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TeamModule } from './team/team.module';
import { PopupsModule } from './popups/popups.module';
import { HomepageModule } from './homepage/homepage.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/uploads',
    }),
    // In-memory caching for performance optimization
    CacheModule.register({
      isGlobal: true,
      ttl: 30000, // 30 seconds default TTL
      max: 100, // max 100 items in cache
    }),
    // Rate limiting to protect against abuse and DDoS
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per 60 seconds
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbSsl = configService.get<string>('DB_SSL');
        // If Supabase, pooler, or remote host, or DB_SSL is explicitly true, enable SSL
        const isSsl =
          dbSsl === 'true' ||
          (databaseUrl &&
            !databaseUrl.includes('localhost') &&
            !databaseUrl.includes('127.0.0.1'));

        const sslConfig = isSsl ? { rejectUnauthorized: false } : false;

        const extraPoolConfig = {
          max: 10,
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 30000,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10000,
        };

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize:
              configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
            ssl: sslConfig,
            extra: extraPoolConfig,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<number>('DB_PORT', 5432)),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'gccf_db'),
          autoLoadEntities: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize:
            configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
          ssl: sslConfig,
          extra: extraPoolConfig,
        };
      },
    }),
    SupabaseModule,
    MailModule,
    AdminModule,
    AuthModule,
    AnalyticsModule,
    EventsModule,
    NewsModule,
    GalleryModule,
    MembershipsModule,
    SettingsModule,
    TeamModule,
    PopupsModule,
    HomepageModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

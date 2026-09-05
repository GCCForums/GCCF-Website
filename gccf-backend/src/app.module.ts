import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
            ssl: sslConfig,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<number>('DB_PORT', 5432)),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'gccf_db'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
          ssl: sslConfig,
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
  ],
})
export class AppModule {}


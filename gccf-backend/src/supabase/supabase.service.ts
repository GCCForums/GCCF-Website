import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (supabaseUrl && supabaseKey) {
      this.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      this.logger.log('Supabase client initialized successfully');
    } else {
      this.logger.warn(
        'Supabase credentials (SUPABASE_URL / SUPABASE_KEY) not provided. Supabase SDK client is inactive (PostgreSQL connection remains active via TypeORM).',
      );
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  isAvailable(): boolean {
    return this.client !== null;
  }
}

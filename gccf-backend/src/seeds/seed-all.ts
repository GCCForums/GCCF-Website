import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EventsService } from '../events/events.service';
import { completedEventsData } from './seed-completed-events';
import { upcomingEventsData } from './seed-upcoming-events';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventsService = app.get(EventsService);

  console.log('\n🚀 Starting database seeding...\n');
  console.log('='.repeat(50));

  // Clear existing events
  console.log('\n🗑️  Clearing existing events...');
  const existingEvents = await eventsService.findAll();
  for (const event of existingEvents) {
    await eventsService.remove(event.id);
  }
  console.log('✅ Cleared all existing events\n');

  console.log('='.repeat(50));

  // Seed Completed Events
  console.log('\n🔵 Seeding COMPLETED events...\n');

  for (const event of completedEventsData) {
    await eventsService.create(event);
    console.log(`✅ Created: ${event.title}`);
  }

  console.log(`\n🎉 Successfully seeded ${completedEventsData.length} completed events!\n`);

  console.log('='.repeat(50));

  // Seed Upcoming Events
  console.log('\n🟢 Seeding UPCOMING events...\n');

  for (const event of upcomingEventsData) {
    await eventsService.create(event);
    console.log(`✅ Created: ${event.title}`);
  }

  console.log(`\n🎉 Successfully seeded ${upcomingEventsData.length} upcoming events!\n`);

  console.log('='.repeat(50));
  console.log('\n✨ All seeding completed successfully!\n');

  await app.close();
}

bootstrap().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

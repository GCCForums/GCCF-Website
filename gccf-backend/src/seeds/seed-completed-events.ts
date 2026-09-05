export const completedEventsData = [
  {
    title: 'Global Cybersecurity Summit 2024',
    slug: 'global-cybersecurity-summit-2024',
    description: `The Global Cybersecurity Summit 2024 was a groundbreaking event that brought together over 500 cybersecurity professionals, industry leaders, and government officials from around the world.

Key highlights included:
- Keynote speeches from leading cybersecurity experts
- Panel discussions on emerging threats and AI security
- Hands-on workshops on penetration testing and incident response
- Networking opportunities with industry pioneers
- Exhibition of latest security technologies

The event covered critical topics including zero-trust architecture, cloud security, ransomware defense, and the future of cybersecurity in the age of quantum computing.`,
    shortDescription: 'A premier gathering of 500+ cybersecurity professionals discussing emerging threats, AI security, and the future of digital defense.',
    eventDate: new Date('2024-09-15'),
    location: 'New Delhi, India',
    status: 'completed' as const,
    mainImage: 'http://localhost:4000/uploads/events/completed/event1-main.jpg',
    galleryImages: [
      'http://localhost:4000/uploads/events/completed/event1-gallery-1.jpg',
      'http://localhost:4000/uploads/events/completed/event1-gallery-2.jpg',
      'http://localhost:4000/uploads/events/completed/event1-gallery-3.jpg',
    ],
    organizer: 'GCCF',
    attendees: 523,
  },
  {
    title: 'Cybersecurity Workshop: Ethical Hacking Fundamentals',
    slug: 'ethical-hacking-fundamentals-workshop',
    description: `An intensive two-day workshop designed for aspiring ethical hackers and security professionals looking to enhance their penetration testing skills.

Workshop covered:
- Introduction to ethical hacking methodologies
- Network scanning and enumeration techniques
- Web application security testing
- Exploitation techniques and tools (Metasploit, Burp Suite)
- Post-exploitation and privilege escalation
- Report writing and remediation recommendations

Participants received hands-on training in a controlled lab environment with real-world scenarios and challenges. Each attendee received a certificate of completion and access to exclusive learning materials.`,
    shortDescription: 'Intensive two-day hands-on training in ethical hacking, penetration testing, and web application security for security professionals.',
    eventDate: new Date('2024-10-20'),
    location: 'Mumbai, India',
    status: 'completed' as const,
    mainImage: 'http://localhost:4000/uploads/events/completed/event2-main.jpg',
    galleryImages: [
      'http://localhost:4000/uploads/events/completed/event2-gallery-1.jpg',
      'http://localhost:4000/uploads/events/completed/event2-gallery-2.jpg',
    ],
    organizer: 'GCCF Training Division',
    attendees: 75,
  },
];

// This allows the file to be run standalone
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EventsService } from '../events/events.service';

async function seedCompletedEvents() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventsService = app.get(EventsService);

  console.log('🔵 Seeding COMPLETED events...\n');

  for (const event of completedEventsData) {
    await eventsService.create(event);
    console.log(`✅ Created: ${event.title}`);
  }

  console.log(`\n🎉 Successfully seeded ${completedEventsData.length} completed events!\n`);
  await app.close();
}

// Only run if this file is executed directly
if (require.main === module) {
  seedCompletedEvents().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

export default seedCompletedEvents;
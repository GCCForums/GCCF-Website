export const upcomingEventsData = [
  {
    title: 'AI in Cybersecurity: Future Threats and Defenses',
    slug: 'ai-cybersecurity-future-2025',
    description: `Join us for an exclusive conference exploring the intersection of artificial intelligence and cybersecurity.

Event Highlights:
- Keynote: "AI-Powered Threat Detection" by leading security researchers
- Panel Discussion: Ethics of AI in Security Operations
- Live Demonstrations: Machine Learning for Anomaly Detection
- Workshop: Building AI-Based Security Tools
- Networking with AI/ML security professionals

Topics Include:
- Adversarial AI and deepfake detection
- Automated incident response systems
- AI-driven vulnerability assessment
- Future of security operations centers (SOCs)
- Regulatory compliance in AI security

This conference is perfect for security professionals, data scientists, and technology leaders looking to stay ahead of emerging threats in the AI era.`,
    shortDescription: 'Explore the cutting edge of AI-powered cybersecurity with leading experts, live demos, and hands-on workshops on ML-based threat detection.',
    eventDate: new Date('2025-03-15'),
    location: 'Bangalore, India',
    status: 'upcoming' as const,
    mainImage: 'http://localhost:4000/uploads/events/upcoming/event2-main.jpg',
    galleryImages: [
      'http://localhost:4000/uploads/events/upcoming/event2-gallery-1.jpg',
      'http://localhost:4000/uploads/events/upcoming/event2-gallery-2.jpg',
    ],
    organizer: 'GCCF',
    attendees: 0,
  },
  {
    title: 'Cloud Security Summit 2025',
    slug: 'cloud-security-summit-2025',
    description: `A comprehensive summit focused on securing cloud infrastructure and applications in the modern enterprise.

What to Expect:
- Expert sessions on AWS, Azure, and GCP security
- Hands-on labs: Securing Kubernetes clusters
- Case studies from Fortune 500 companies
- Zero-trust architecture implementation
- Container security best practices
- DevSecOps automation strategies

Key Topics:
- Cloud-native security tools and platforms
- Identity and Access Management (IAM) strategies
- Data encryption and key management
- Compliance frameworks (SOC2, ISO 27001, GDPR)
- Multi-cloud security challenges
- Serverless security considerations

Perfect for cloud architects, DevOps engineers, security engineers, and IT managers responsible for cloud infrastructure.`,
    shortDescription: 'Master cloud security with hands-on labs, expert sessions on AWS/Azure/GCP, and real-world case studies from industry leaders.',
    eventDate: new Date('2025-05-20'),
    location: 'Hyderabad, India',
    status: 'upcoming' as const,
    mainImage: 'http://localhost:4000/uploads/events/upcoming/event1-main.jpg',
    galleryImages: [
      'http://localhost:4000/uploads/events/upcoming/event1-gallery-1.jpg',
      'http://localhost:4000/uploads/events/upcoming/event1-gallery-2.jpg',
      'http://localhost:4000/uploads/events/upcoming/event1-gallery-1.jpg',
    ],
    organizer: 'GCCF',
    attendees: 0,
  },
];

// This allows the file to be run standalone
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EventsService } from '../events/events.service';

async function seedUpcomingEvents() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventsService = app.get(EventsService);

  console.log('🟢 Seeding UPCOMING events...\n');

  for (const event of upcomingEventsData) {
    await eventsService.create(event);
    console.log(`✅ Created: ${event.title}`);
  }

  console.log(`\n🎉 Successfully seeded ${upcomingEventsData.length} upcoming events!\n`);
  await app.close();
}

// Only run if this file is executed directly
if (require.main === module) {
  seedUpcomingEvents().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

export default seedUpcomingEvents;
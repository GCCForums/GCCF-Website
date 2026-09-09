import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TeamService } from '../team/team.service';
import { PopupsService } from '../popups/popups.service';

export const initialTeamData = [
  {
    name: 'Sarah Mitchell',
    title: 'Founder & CEO',
    affiliatedPart: 'Executive Leadership / Global Chapter',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    email: 'sarah@gccf.org',
    linkedin: 'https://linkedin.com',
    order: 1,
    isActive: true,
  },
  {
    name: 'David Chen',
    title: 'Director of Operations',
    affiliatedPart: 'Operations & Partnerships',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    email: 'david@gccf.org',
    linkedin: 'https://linkedin.com',
    order: 2,
    isActive: true,
  },
  {
    name: 'Maya Patel',
    title: 'Program Manager',
    affiliatedPart: 'Community Initiatives & Standards',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
    email: 'maya@gccf.org',
    linkedin: 'https://linkedin.com',
    order: 3,
    isActive: true,
  },
  {
    name: 'James Wilson',
    title: 'Communications Lead',
    affiliatedPart: 'Global Outreach & Public Relations',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
    email: 'james@gccf.org',
    linkedin: 'https://linkedin.com',
    order: 4,
    isActive: true,
  },
  {
    name: 'Aisha Rahman',
    title: 'Community Outreach',
    affiliatedPart: 'Regional Chapters & Engagement',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    email: 'aisha@gccf.org',
    linkedin: 'https://linkedin.com',
    order: 5,
    isActive: true,
  },
  {
    name: 'Michael Torres',
    title: 'Finance Director',
    affiliatedPart: 'Finance & Resource Governance',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    email: 'michael@gccf.org',
    linkedin: 'https://linkedin.com',
    order: 6,
    isActive: true,
  },
];

export const initialPopupData = [
  {
    name: 'GCCF Annual Cyber Summit Announcement',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    enabled: true,
    delaySeconds: 3,
    linkUrl: '/events',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const teamService = app.get(TeamService);
  const popupsService = app.get(PopupsService);

  console.log('\n🚀 Starting Team & Popups database seeding...\n');
  console.log('='.repeat(50));

  // 1. Seed Team Members
  console.log('\n👥 Seeding Team Members...\n');
  const existingTeam = await teamService.findAll();
  if (existingTeam.length === 0) {
    for (const member of initialTeamData) {
      await teamService.create(member);
      console.log(`✅ Created Team Member: ${member.name} (${member.title})`);
    }
  } else {
    console.log(`ℹ️  Found ${existingTeam.length} existing team members, skipping team creation.`);
  }

  // 2. Seed Popups
  console.log('\n🔔 Seeding Popups...\n');
  const existingPopups = await popupsService.findAll();
  if (existingPopups.length === 0) {
    for (const popup of initialPopupData) {
      await popupsService.create(popup);
      console.log(`✅ Created Popup: ${popup.name}`);
    }
  } else {
    console.log(`ℹ️  Found ${existingPopups.length} existing popups, skipping popup creation.`);
  }

  console.log('='.repeat(50));
  console.log('\n✨ Team and Popups seeding completed!\n');

  await app.close();
}

if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

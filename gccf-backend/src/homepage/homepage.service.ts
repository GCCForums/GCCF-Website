import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageContent } from './entities/homepage.entity';
import { UpdateHomepageDto } from './dto/update-homepage.dto';

export const DEFAULT_HOMEPAGE_CONTENT = {
  hero: {
    badge: 'GLOBAL CYBERSECURITY FORUM',
    title: 'Protecting the Digital World',
    titleHighlight: 'Together',
    subtitle:
      'Join thousands of cybersecurity practitioners, researchers, and enterprise defenders. Share threat intelligence, collaborate on live defense, and elevate the security posture of global systems.',
    primaryButtonText: 'Join Our Community',
    primaryButtonUrl: '/membership',
    secondaryButtonText: 'Explore Events',
    secondaryButtonUrl: '/events',
  },
  metrics: {
    backgroundImage: '/statsbg2.png',
    items: [
      { number: '15+', label: 'Years of Impact' },
      { number: '50K+', label: 'Lives Touched' },
      { number: '120+', label: 'Active Projects' },
      { number: '35+', label: 'Countries' },
    ],
  },
  about: {
    badge: 'About GCCF',
    title: 'Building a Safer Digital Future',
    paragraphs: [
      'The Global Cybersecurity Community Forum (GCCF) is a vibrant, international platform dedicated to fostering collaboration, knowledge sharing, and innovation in cybersecurity.',
      'Founded by industry leaders and passionate professionals, we bring together experts, learners, and organizations to address the ever-evolving challenges in digital security.',
      'Our mission is to create a trusted ecosystem where members can grow their skills, share insights, and contribute to a safer digital future.',
      "Through events, training programs, and collaborative initiatives, we're building the next generation of cybersecurity excellence.",
    ],
  },
  faq: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What is GCCF?',
        answer:
          'GCCF (Global Cybersecurity Community Forum) is a worldwide community dedicated to bringing together cybersecurity professionals, enthusiasts, and learners to share knowledge, collaborate, and advance the field of cybersecurity.',
      },
      {
        question: 'How can I join the community?',
        answer:
          "You can join by clicking the 'Join Our Community' button and filling out a simple registration form. Membership is open to anyone interested in cybersecurity, regardless of experience level.",
      },
      {
        question: 'Are there membership fees?',
        answer:
          'Basic membership is completely free. We also offer premium memberships with additional benefits such as exclusive workshops, certification programs, and priority event access.',
      },
      {
        question: 'What types of events do you organize?',
        answer:
          'We organize a variety of events including workshops, conferences, hackathons, webinars, and networking meetups. Events cover topics from ethical hacking to cloud security, threat intelligence, and more.',
      },
      {
        question: 'Can beginners join GCCF?',
        answer:
          'Absolutely! We welcome members of all skill levels. We have dedicated programs and resources for beginners, including mentorship opportunities and foundational training sessions.',
      },
    ],
  },
  extraSections: {},
};

@Injectable()
export class HomepageService implements OnModuleInit {
  constructor(
    @InjectRepository(HomepageContent)
    private readonly homepageRepository: Repository<HomepageContent>,
  ) {}

  async onModuleInit() {
    await this.ensureInitialContent();
  }

  private async ensureInitialContent(): Promise<void> {
    const count = await this.homepageRepository.count();
    if (count === 0) {
      const initial = this.homepageRepository.create(DEFAULT_HOMEPAGE_CONTENT);
      await this.homepageRepository.save(initial);
      console.log('Homepage default content initialized in database');
    }
  }

  async getContent(): Promise<HomepageContent> {
    let content = await this.homepageRepository.findOne({
      where: {},
      order: { id: 'ASC' },
    });

    if (!content) {
      const initial = this.homepageRepository.create(DEFAULT_HOMEPAGE_CONTENT);
      content = await this.homepageRepository.save(initial);
    }

    return content;
  }

  async updateContent(dto: UpdateHomepageDto): Promise<HomepageContent> {
    let content = await this.homepageRepository.findOne({
      where: {},
      order: { id: 'ASC' },
    });

    if (!content) {
      content = this.homepageRepository.create(DEFAULT_HOMEPAGE_CONTENT);
    }

    if (dto.hero !== undefined) {
      content.hero = { ...content.hero, ...dto.hero };
    }
    if (dto.metrics !== undefined) {
      content.metrics = { ...content.metrics, ...dto.metrics };
    }
    if (dto.about !== undefined) {
      content.about = { ...content.about, ...dto.about };
    }
    if (dto.faq !== undefined) {
      content.faq = { ...content.faq, ...dto.faq };
    }
    if (dto.extraSections !== undefined) {
      content.extraSections = { ...content.extraSections, ...dto.extraSections };
    }

    return this.homepageRepository.save(content);
  }

  async resetDefaults(): Promise<HomepageContent> {
    let content = await this.homepageRepository.findOne({
      where: {},
      order: { id: 'ASC' },
    });

    if (!content) {
      content = this.homepageRepository.create(DEFAULT_HOMEPAGE_CONTENT);
    } else {
      content.hero = DEFAULT_HOMEPAGE_CONTENT.hero;
      content.metrics = DEFAULT_HOMEPAGE_CONTENT.metrics;
      content.about = DEFAULT_HOMEPAGE_CONTENT.about;
      content.faq = DEFAULT_HOMEPAGE_CONTENT.faq;
      content.extraSections = DEFAULT_HOMEPAGE_CONTENT.extraSections;
    }

    return this.homepageRepository.save(content);
  }
}

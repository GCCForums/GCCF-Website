import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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
  chairpersonMessage: {
    badge: 'LEADERSHIP MESSAGE',
    title: 'Message from the CEO',
    chairpersonName: 'Dr. Sarah Mitchell',
    chairpersonTitle: 'CEO & Executive Director, GCCF',
    quote:
      'Cybersecurity is no longer just a technical defense; it is the cornerstone of societal trust, global resilience, and collective progress.',
    message:
      'At GCCF, our conviction is that no individual, organization, or nation can face the rapidly mutating landscape of cyber threats in isolation. By cultivating a collaborative ecosystem of researchers, industry practitioners, and policymakers, we transform vulnerability into proactive collective defense. We welcome you to unite with our mission, share your expertise, and build an open, secure digital future for everyone.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    signatureText: 'Dr. Sarah Mitchell, CEO',
    isActive: true,
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
  services: {
    badge: 'What We Offer',
    title: 'Services & Activities',
    items: [
      {
        icon: 'FaShieldAlt',
        title: 'Security Training',
        description:
          'Comprehensive training programs for individuals and organizations',
      },
      {
        icon: 'FaUsers',
        title: 'Community Events',
        description: 'Regular meetups, workshops, and networking opportunities',
      },
      {
        icon: 'FaBook',
        title: 'Knowledge Sharing',
        description: 'Access to resources, articles, and industry insights',
      },
      {
        icon: 'FaBullseye',
        title: 'Career Development',
        description: 'Job opportunities and mentorship programs',
      },
      {
        icon: 'FaMicroscope',
        title: 'Research & Innovation',
        description:
          'Collaborative research projects and security innovations',
      },
      {
        icon: 'FaGlobe',
        title: 'Global Network',
        description: 'Connect with cybersecurity professionals worldwide',
      },
    ],
  },
  extraSections: {},
};

@Injectable()
export class HomepageService implements OnModuleInit {
  private readonly logger = new Logger(HomepageService.name);

  constructor(
    @InjectRepository(HomepageContent)
    private readonly homepageRepository: Repository<HomepageContent>,
  ) {}

  async onModuleInit() {
    await this.ensureInitialContent();
  }

  private async ensureInitialContent(): Promise<void> {
    const content = await this.homepageRepository.findOne({
      where: {},
      order: { id: 'ASC' },
    });
    if (!content) {
      const initial = this.homepageRepository.create(DEFAULT_HOMEPAGE_CONTENT);
      await this.homepageRepository.save(initial);
      this.logger.log('Homepage default content initialized in database');
    } else {
      let needsSave = false;
      if (!content.chairpersonMessage) {
        content.chairpersonMessage = DEFAULT_HOMEPAGE_CONTENT.chairpersonMessage;
        needsSave = true;
      } else if (
        content.chairpersonMessage.title ===
        'Guiding the Future of Global Cybersecurity'
      ) {
        content.chairpersonMessage.title = 'Message from the CEO';
        content.chairpersonMessage.chairpersonTitle =
          'CEO & Executive Director, GCCF';
        content.chairpersonMessage.signatureText = 'Dr. Sarah Mitchell, CEO';
        needsSave = true;
      }
      if (!content.services) {
        content.services = DEFAULT_HOMEPAGE_CONTENT.services;
        needsSave = true;
      }
      if (needsSave) {
        await this.homepageRepository.save(content);
        this.logger.log('Synced chairpersonMessage and services in database');
      }
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
    } else if (!content.chairpersonMessage) {
      content.chairpersonMessage = DEFAULT_HOMEPAGE_CONTENT.chairpersonMessage;
      await this.homepageRepository.save(content);
    } else if (
      content.chairpersonMessage.title ===
      'Guiding the Future of Global Cybersecurity'
    ) {
      content.chairpersonMessage.title = 'Message from the CEO';
      content.chairpersonMessage.chairpersonTitle =
        'CEO & Executive Director, GCCF';
      content.chairpersonMessage.signatureText = 'Dr. Sarah Mitchell, CEO';
      await this.homepageRepository.save(content);
    }

    if (!content.services) {
      content.services = DEFAULT_HOMEPAGE_CONTENT.services;
      await this.homepageRepository.save(content);
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
    if (dto.chairpersonMessage !== undefined) {
      content.chairpersonMessage = {
        ...(content.chairpersonMessage || DEFAULT_HOMEPAGE_CONTENT.chairpersonMessage),
        ...dto.chairpersonMessage,
      };
    }
    if (dto.about !== undefined) {
      content.about = { ...content.about, ...dto.about };
    }
    if (dto.faq !== undefined) {
      content.faq = { ...content.faq, ...dto.faq };
    }
    if (dto.services !== undefined) {
      content.services = { ...(content.services || DEFAULT_HOMEPAGE_CONTENT.services), ...dto.services };
      content.extraSections = {
        ...(content.extraSections || {}),
        services: content.services,
      };
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
      content.chairpersonMessage = DEFAULT_HOMEPAGE_CONTENT.chairpersonMessage;
      content.about = DEFAULT_HOMEPAGE_CONTENT.about;
      content.faq = DEFAULT_HOMEPAGE_CONTENT.faq;
      content.services = DEFAULT_HOMEPAGE_CONTENT.services;
      content.extraSections = DEFAULT_HOMEPAGE_CONTENT.extraSections;
    }

    return this.homepageRepository.save(content);
  }
}

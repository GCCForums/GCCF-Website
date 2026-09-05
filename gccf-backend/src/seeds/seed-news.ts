import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { NewsService } from '../news/news.service';

export const newsData = [
  {
    title: 'Major Data Breach Affects 50 Million Users Worldwide',
    slug: 'major-data-breach-50-million-users',
    content: `A massive data breach has been discovered affecting over 50 million users across multiple platforms. Security researchers identified the vulnerability in a widely-used authentication service that allowed unauthorized access to user credentials.

The breach was first detected by cybersecurity firm ThreatWatch on January 15th, when unusual data access patterns were flagged in their monitoring systems. The compromised data includes email addresses, hashed passwords, and in some cases, phone numbers.

Security experts are advising all affected users to immediately change their passwords and enable two-factor authentication on all accounts. The authentication service provider has issued a statement confirming the breach and outlined steps being taken to secure systems and notify affected users.

"This incident highlights the critical importance of robust security practices and the need for organizations to prioritize cybersecurity investments," said Dr. Sarah Chen, Chief Security Officer at CyberDefense Solutions.

The investigation is ongoing, and law enforcement agencies have been notified. Users are encouraged to monitor their accounts for suspicious activity and report any concerns immediately.`,
    excerpt: 'Security researchers discover vulnerability in authentication service exposing millions of user credentials. Immediate password changes recommended.',
    publishedDate: new Date('2025-01-28'),
    author: 'Alex Rodriguez',
    category: 'Data Breach',
    featuredImage: 'http://localhost:4000/uploads/news/news1.jpg',
    tags: ['data breach', 'cybersecurity', 'authentication', 'security'],
    source: 'GCCF News Team',
    sourceUrl: null,
  },
  {
    title: 'New Ransomware Variant Targets Healthcare Organizations',
    slug: 'new-ransomware-healthcare-organizations',
    content: `A sophisticated new ransomware variant has emerged, specifically targeting healthcare organizations and medical facilities. Security researchers have identified at least 15 healthcare institutions affected in the past two weeks.

The ransomware, dubbed "MediCrypt," employs advanced encryption techniques and targets critical medical systems including patient records, scheduling systems, and diagnostic equipment. Unlike previous ransomware campaigns, this variant appears to be specifically designed to maximize disruption to healthcare services.

"What makes this particularly concerning is the attackers' deep understanding of healthcare IT infrastructure," explains Michael Thompson, Director of Healthcare Cybersecurity at SecureHealth Alliance. "They're not just encrypting files – they're targeting systems in a way that causes maximum operational disruption."

The attackers are demanding ransoms ranging from $500,000 to $2 million in cryptocurrency, with payment deadlines as short as 48 hours. Several affected organizations have reported being forced to divert patients to other facilities and cancel non-emergency procedures.

Federal agencies including the FBI and CISA have issued joint advisories urging healthcare organizations to review their security postures and implement recommended mitigation strategies. These include network segmentation, regular backups, and employee security training.

Healthcare organizations are advised to maintain offline backups of critical data and implement multi-factor authentication across all systems. The investigation into the ransomware group's identity and infrastructure is ongoing.`,
    excerpt: 'Healthcare sector faces new targeted ransomware threat. MediCrypt variant disrupts critical medical systems and patient care services.',
    publishedDate: new Date('2025-01-26'),
    author: 'Jessica Martinez',
    category: 'Ransomware',
    featuredImage: 'http://localhost:4000/uploads/news/news2.jpg',
    tags: ['ransomware', 'healthcare', 'malware', 'cybercrime'],
    source: 'GCCF News Team',
    sourceUrl: null,
  },
  {
    title: 'AI-Powered Phishing Attacks Surge by 300% in Q4 2024',
    slug: 'ai-powered-phishing-attacks-surge-2024',
    content: `Cybersecurity firms report a dramatic 300% increase in AI-powered phishing attacks during the fourth quarter of 2024, marking a significant evolution in social engineering tactics.

These sophisticated attacks leverage large language models to create highly convincing phishing emails that bypass traditional detection systems. Unlike conventional phishing campaigns, these AI-generated messages contain virtually no grammatical errors and demonstrate deep contextual awareness.

"The quality and personalization of these attacks is unprecedented," notes Dr. Emily Watson, Chief Research Officer at PhishGuard Analytics. "Attackers are using AI to analyze targets' social media profiles, writing styles, and professional contexts to craft perfectly tailored messages."

The attacks have successfully compromised several Fortune 500 companies, with losses estimated in the hundreds of millions of dollars. In one notable case, an AI-generated email impersonating a CEO convinced a financial controller to authorize a $2.3 million wire transfer.

Security experts recommend organizations implement advanced email authentication protocols, conduct regular employee training on identifying sophisticated phishing attempts, and deploy AI-based detection systems capable of analyzing communication patterns.

Industry leaders are calling for updated security frameworks that account for AI-enhanced threats. The Cybersecurity and Infrastructure Security Agency (CISA) has announced plans to release new guidelines specifically addressing AI-powered social engineering attacks.

Organizations are urged to adopt a zero-trust security model and implement multi-factor authentication for all sensitive transactions, regardless of the apparent source of requests.`,
    excerpt: 'AI-generated phishing emails bypass traditional defenses with unprecedented sophistication. Organizations urged to update security protocols.',
    publishedDate: new Date('2025-01-24'),
    author: 'David Kim',
    category: 'Phishing',
    featuredImage: 'http://localhost:4000/uploads/news/news3.jpg',
    tags: ['AI', 'phishing', 'social engineering', 'cybersecurity'],
    source: 'GCCF News Team',
    sourceUrl: null,
  },
  {
    title: 'Critical Zero-Day Vulnerability Discovered in Popular IoT Devices',
    slug: 'zero-day-vulnerability-iot-devices',
    content: `Security researchers have disclosed a critical zero-day vulnerability affecting millions of Internet of Things (IoT) devices worldwide. The flaw, present in a widely-used chipset, could allow attackers to gain complete control of affected devices.

The vulnerability, assigned CVE-2025-1234, affects smart home devices, security cameras, and industrial IoT equipment from multiple manufacturers. Researchers estimate that over 100 million devices globally may be vulnerable.

"This is a supply chain security issue at its core," explains Robert Chen, Lead Security Researcher at IoTSec Labs. "The vulnerability exists in firmware that's been incorporated into thousands of different products over the past three years."

Proof-of-concept exploits have already appeared on underground forums, raising concerns about widespread exploitation. The vulnerability allows attackers to execute arbitrary code, potentially turning devices into botnet participants or using them as entry points into corporate networks.

Major manufacturers have begun releasing security patches, but the fragmented nature of the IoT ecosystem means many devices may never receive updates. Security experts are advising organizations to isolate IoT devices on separate network segments and implement strict access controls.

The Department of Homeland Security has issued an alert urging critical infrastructure operators to assess their IoT device inventories and apply available patches immediately. For devices that cannot be patched, network-level protections and monitoring are recommended.

This incident has renewed calls for mandatory security standards in IoT manufacturing and clearer disclosure of device support lifecycles.`,
    excerpt: 'Widespread IoT chipset vulnerability affects over 100 million devices. Immediate patching and network segmentation recommended.',
    publishedDate: new Date('2025-01-22'),
    author: 'Sarah Johnson',
    category: 'Vulnerabilities',
    featuredImage: 'http://localhost:4000/uploads/news/news4.jpg',
    tags: ['IoT', 'zero-day', 'vulnerability', 'security patch'],
    source: 'GCCF News Team',
    sourceUrl: null,
  },
  {
    title: 'Quantum Computing Breakthrough Raises Encryption Concerns',
    slug: 'quantum-computing-encryption-breakthrough',
    content: `Researchers at a leading technology institute have achieved a significant breakthrough in quantum computing that brings the timeline for breaking current encryption standards closer than previously anticipated.

The development involves a new quantum algorithm that could potentially decrypt RSA-2048 encryption in a fraction of the time previously estimated. While practical implementation is still years away, the advancement has prompted urgent discussions about post-quantum cryptography preparedness.

"This is a wake-up call for organizations still relying solely on traditional encryption methods," states Dr. Jennifer Liu, Director of Quantum Security Research at the National Cryptography Center. "The transition to quantum-resistant cryptography needs to accelerate."

Financial institutions, government agencies, and healthcare organizations are particularly at risk, as they handle sensitive data that must remain secure for decades. Security experts warn about "harvest now, decrypt later" attacks, where adversaries collect encrypted data today with the intention of decrypting it once quantum computers become available.

The National Institute of Standards and Technology (NIST) has already published standards for post-quantum cryptographic algorithms. However, adoption has been slow, with many organizations unaware of the timeline or unsure how to implement the transition.

Industry leaders are calling for coordinated efforts to develop and deploy quantum-resistant encryption across critical infrastructure. The estimated cost of transitioning to post-quantum cryptography for large enterprises is projected to be in the tens of millions of dollars.

Cybersecurity professionals recommend organizations begin assessing their cryptographic inventories and developing migration strategies immediately, even if quantum computers capable of breaking current encryption are still several years away.`,
    excerpt: 'New quantum computing advancement accelerates timeline for breaking current encryption. Organizations urged to prepare for post-quantum cryptography.',
    publishedDate: new Date('2025-01-20'),
    author: 'Michael Zhang',
    category: 'Emerging Threats',
    featuredImage: 'http://localhost:4000/uploads/news/news5.jpg',
    tags: ['quantum computing', 'encryption', 'post-quantum cryptography', 'security'],
    source: 'GCCF News Team',
    sourceUrl: null,
  },
];

async function seedNews() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const newsService = app.get(NewsService);

  console.log('📰 Seeding NEWS articles...\n');

  for (const articleData of newsData) {
    try {
      await newsService.create(articleData as any);
      console.log(`✅ Created: ${articleData.title}`);
    } catch (error) {
      console.error(`❌ Failed to create: ${articleData.title}`, error.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${newsData.length} news articles!\n`);
  await app.close();
}

// Only run if this file is executed directly
if (require.main === module) {
  seedNews().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

export default seedNews;
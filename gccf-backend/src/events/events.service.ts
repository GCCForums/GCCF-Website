import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { MailService } from '../mail/mail.service';
import { Membership } from '../memberships/entities/membership.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    private mailService: MailService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    const savedEvent = await this.eventsRepository.save(event);
    
    if (savedEvent.status === 'upcoming') {
      await this.sendNewsletterToApprovedMembers(savedEvent);
    }
    
    return savedEvent;
  }

  async findAll(): Promise<Event[]> {
    return await this.eventsRepository.find({
      order: { eventDate: 'DESC' },
    });
  }

  async findCompleted(): Promise<Event[]> {
    return await this.eventsRepository.find({
      where: { status: 'completed' },
      order: { eventDate: 'DESC' },
    });
  }

  async findUpcoming(): Promise<Event[]> {
    return await this.eventsRepository.find({
      where: { status: 'upcoming' },
      order: { eventDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { slug } });
    if (!event) {
      throw new NotFoundException(`Event with slug ${slug} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.findOne(id);
    await this.eventsRepository.update(id, updateEventDto);
    const updatedEvent = await this.findOne(id);
    
    if (updateEventDto.status === 'upcoming' && existingEvent.status !== 'upcoming') {
      await this.sendNewsletterToApprovedMembers(updatedEvent);
    }
    
    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  private async sendNewsletterToApprovedMembers(event: Event): Promise<void> {
    try {
      const approvedMembers = await this.membershipsRepository.find({
        where: { status: 'approved' },
      });

      if (approvedMembers.length === 0) {
        this.logger.log('No approved members to send newsletter to');
        return;
      }

      this.logger.log(`Sending newsletter for event "${event.title}" to ${approvedMembers.length} approved members`);

      await Promise.all(
        approvedMembers.map((member) =>
          this.mailService.sendNewsletterToMember(
            member.email,
            member.firstName,
            event.title,
            event.eventDate.toISOString(),
            event.location,
            event.shortDescription,
          ),
        ),
      );

      this.logger.log(`Newsletter sent successfully to ${approvedMembers.length} members`);
    } catch (error) {
      this.logger.error('Failed to send newsletter to members', error);
    }
  }
}
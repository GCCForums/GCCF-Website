import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    private mailService: MailService,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const membership = this.membershipsRepository.create(createMembershipDto);
    return await this.membershipsRepository.save(membership);
  }

  async findAll(): Promise<Membership[]> {
    return await this.membershipsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPending(): Promise<Membership[]> {
    return await this.membershipsRepository.find({
      where: { status: 'pending' },
      order: { createdAt: 'DESC' },
    });
  }

  async findApproved(): Promise<Membership[]> {
    return await this.membershipsRepository.find({
      where: { status: 'approved' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipsRepository.findOne({ where: { id } });
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    return membership;
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    const membership = await this.findOne(id);
    
    if (updateMembershipDto.status && updateMembershipDto.status !== membership.status) {
      if (updateMembershipDto.status === 'approved') {
        await this.mailService.sendMembershipApprovalEmail(
          membership.email,
          membership.firstName,
          membership.lastName,
        );
      } else if (updateMembershipDto.status === 'declined') {
        await this.mailService.sendMembershipDeclineEmail(
          membership.email,
          membership.firstName,
          membership.lastName,
        );
      }
    }
    
    await this.membershipsRepository.update(id, updateMembershipDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.membershipsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
  }
}
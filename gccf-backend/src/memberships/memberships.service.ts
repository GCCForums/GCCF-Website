import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MailService } from '../mail/mail.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class MembershipsService {
  private readonly logger = new Logger(MembershipsService.name);

  constructor(
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    private mailService: MailService,
    private uploadService: UploadService,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    // If the payment slip is a base64 data URL, upload to Cloudinary for optimized storage
    if (
      createMembershipDto.paymentAttachment &&
      createMembershipDto.paymentAttachment.startsWith('data:')
    ) {
      try {
        createMembershipDto.paymentAttachment =
          await this.uploadService.uploadBase64(
            createMembershipDto.paymentAttachment,
            'gccf_memberships/receipts',
          );
      } catch (err: any) {
        this.logger.warn(
          `Cloudinary upload encountered an issue, storing attachment directly: ${err?.message}`,
        );
      }
    }

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
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    const membership = await this.membershipsRepository.findOne({
      where: { id },
    });
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    return membership;
  }

  async update(
    id: string,
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<Membership> {
    const membership = await this.findOne(id);

    // 1. Update the database first so the transaction is always persisted
    await this.membershipsRepository.update(id, updateMembershipDto);
    const updatedMembership = await this.findOne(id);

    // 2. Trigger notification email when status is set to approved or declined
    if (updateMembershipDto.status === 'approved') {
      this.logger.log(
        `[MembershipsService] Status set to approved for ${membership.email}. Sending approval email...`,
      );
      try {
        await this.mailService.sendMembershipApprovalEmail(
          membership.email,
          membership.firstName,
          membership.lastName,
        );
      } catch (mailErr: any) {
        this.logger.error(
          `Failed to deliver approval email to ${membership.email}: ${mailErr?.message}`,
        );
      }
    } else if (updateMembershipDto.status === 'declined') {
      this.logger.log(
        `[MembershipsService] Status set to declined for ${membership.email}. Sending decline email...`,
      );
      try {
        await this.mailService.sendMembershipDeclineEmail(
          membership.email,
          membership.firstName,
          membership.lastName,
        );
      } catch (mailErr: any) {
        this.logger.error(
          `Failed to deliver decline email to ${membership.email}: ${mailErr?.message}`,
        );
      }
    }

    return updatedMembership;
  }

  async resendApprovalEmail(id: string): Promise<{ success: boolean; message: string }> {
    const membership = await this.findOne(id);
    this.logger.log(`[MembershipsService] Resending approval email to ${membership.email}...`);
    await this.mailService.sendMembershipApprovalEmail(
      membership.email,
      membership.firstName,
      membership.lastName,
    );
    return {
      success: true,
      message: `Approval email sent to ${membership.email}`,
    };
  }

  async remove(id: string): Promise<void> {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    const result = await this.membershipsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
  }

  async testSmtp(): Promise<any> {
    return await this.mailService.testSmtpConnection();
  }
}

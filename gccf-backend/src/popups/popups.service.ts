import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Popup } from './entities/popup.entity';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';

@Injectable()
export class PopupsService {
  constructor(
    @InjectRepository(Popup)
    private popupsRepository: Repository<Popup>,
  ) {}

  async create(createPopupDto: CreatePopupDto): Promise<Popup> {
    if (createPopupDto.enabled) {
      // Disable any previously active popup so only one is active at a time
      await this.popupsRepository.update({ enabled: true }, { enabled: false });
    }

    const popup = this.popupsRepository.create(createPopupDto);
    return await this.popupsRepository.save(popup);
  }

  async findAll(): Promise<Popup[]> {
    return await this.popupsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findActive(): Promise<Popup | null> {
    return await this.popupsRepository.findOne({
      where: { enabled: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Popup> {
    const popup = await this.popupsRepository.findOne({ where: { id } });
    if (!popup) {
      throw new NotFoundException(`Popup with ID ${id} not found`);
    }
    return popup;
  }

  async update(id: string, updatePopupDto: UpdatePopupDto): Promise<Popup> {
    const popup = await this.findOne(id);

    if (updatePopupDto.enabled) {
      // Disable all other popups if this one is being enabled
      await this.popupsRepository.update(
        { id: Not(id), enabled: true },
        { enabled: false },
      );
    }

    Object.assign(popup, updatePopupDto);
    return await this.popupsRepository.save(popup);
  }

  async toggleEnabled(id: string, enabled: boolean): Promise<Popup> {
    return this.update(id, { enabled });
  }

  async remove(id: string): Promise<void> {
    const popup = await this.findOne(id);
    await this.popupsRepository.remove(popup);
  }
}

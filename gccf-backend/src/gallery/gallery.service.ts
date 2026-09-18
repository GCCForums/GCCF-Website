import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Gallery } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async create(createGalleryDto: CreateGalleryDto): Promise<Gallery> {
    const gallery = this.galleryRepository.create(createGalleryDto);
    return await this.galleryRepository.save(gallery);
  }

  async findAll(): Promise<Gallery[]> {
    return await this.galleryRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findVisible(): Promise<Gallery[]> {
    return await this.galleryRepository.find({
      where: { isVisible: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<Gallery[]> {
    return await this.galleryRepository.find({
      where: { category, isVisible: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Gallery> {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    return gallery;
  }

  async update(
    id: string,
    updateGalleryDto: UpdateGalleryDto,
  ): Promise<Gallery> {
    await this.findOne(id);
    await this.galleryRepository.update(id, updateGalleryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    const result = await this.galleryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
  }

  async reorder(ids: string[]): Promise<Gallery[]> {
    if (!ids || ids.length === 0) return this.findAll();

    await this.galleryRepository.manager.transaction(async (manager) => {
      await Promise.all(
        ids.map((id, index) => manager.update(Gallery, id, { order: index })),
      );
    });
    return this.findAll();
  }
}

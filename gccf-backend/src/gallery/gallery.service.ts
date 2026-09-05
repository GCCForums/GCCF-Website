import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    return gallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto): Promise<Gallery> {
    await this.galleryRepository.update(id, updateGalleryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.galleryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
  }

  async reorder(ids: string[]): Promise<Gallery[]> {
    const updates = ids.map((id, index) =>
      this.galleryRepository.update(id, { order: index })
    );
    await Promise.all(updates);
    return this.findAll();
  }
}
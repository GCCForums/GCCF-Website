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

  private ensureImages(item: Gallery | null): Gallery {
    if (!item) return item as any;
    if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
      item.images = item.imageUrl ? [item.imageUrl] : [];
    }
    return item;
  }

  async create(createGalleryDto: CreateGalleryDto): Promise<Gallery> {
    if (
      (!createGalleryDto.images || createGalleryDto.images.length === 0) &&
      createGalleryDto.imageUrl
    ) {
      createGalleryDto.images = [createGalleryDto.imageUrl];
    } else if (
      createGalleryDto.images &&
      createGalleryDto.images.length > 0 &&
      !createGalleryDto.imageUrl
    ) {
      createGalleryDto.imageUrl = createGalleryDto.images[0];
    }
    const gallery = this.galleryRepository.create(createGalleryDto);
    const saved = await this.galleryRepository.save(gallery);
    return this.ensureImages(saved);
  }

  async findAll(): Promise<Gallery[]> {
    const items = await this.galleryRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
    return items.map((item) => this.ensureImages(item));
  }

  async findVisible(): Promise<Gallery[]> {
    const items = await this.galleryRepository.find({
      where: { isVisible: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
    return items.map((item) => this.ensureImages(item));
  }

  async findOne(id: string): Promise<Gallery> {
    if (!id || !isUUID(id)) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    return this.ensureImages(gallery);
  }

  async update(
    id: string,
    updateGalleryDto: UpdateGalleryDto,
  ): Promise<Gallery> {
    await this.findOne(id);
    if (
      updateGalleryDto.images &&
      updateGalleryDto.images.length > 0 &&
      !updateGalleryDto.imageUrl
    ) {
      updateGalleryDto.imageUrl = updateGalleryDto.images[0];
    }
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

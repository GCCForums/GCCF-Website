import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamMember)
    private teamRepository: Repository<TeamMember>,
  ) {}

  async create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
    const member = this.teamRepository.create(createTeamMemberDto);
    return await this.teamRepository.save(member);
  }

  async findAll(activeOnly: boolean = false): Promise<TeamMember[]> {
    const where = activeOnly ? { isActive: true } : {};
    return await this.teamRepository.find({
      where,
      order: {
        order: 'ASC',
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<TeamMember> {
    const member = await this.teamRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }
    return member;
  }

  async update(
    id: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
  ): Promise<TeamMember> {
    const member = await this.findOne(id);
    Object.assign(member, updateTeamMemberDto);
    return await this.teamRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.teamRepository.remove(member);
  }

  async reorder(ids: string[]): Promise<TeamMember[]> {
    if (!ids || ids.length === 0) return this.findAll();

    await this.teamRepository.manager.transaction(async (manager) => {
      await Promise.all(
        ids.map((id, index) => manager.update(TeamMember, id, { order: index })),
      );
    });
    return this.findAll();
  }
}

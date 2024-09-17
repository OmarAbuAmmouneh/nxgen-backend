import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create(createJobDto);
    return await this.jobsRepository.save(job);
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobsRepository.preload({ id: id, ...updateJobDto });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return this.jobsRepository.save(job);
  }

  async remove(id: number): Promise<void> {
    const job = await this.jobsRepository.findOneBy({ id: id });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    await this.jobsRepository.remove(job);
  }

  findAll(): Promise<Job[]> {
    return this.jobsRepository.find();
  }
}

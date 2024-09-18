import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,

  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create(createJobDto);
    return await this.jobsRepository.save(job);
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    console.log('enter0')
    const job = await this.jobsRepository.preload({ id: id, ...updateJobDto });
    console.log(job, 'enter1')
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

  async findAll(userId?: number): Promise<Job[]> {
    const query = this.jobsRepository
      .createQueryBuilder('job');

    if (userId) {
      query.where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('application.jobId')
          .from(Application, 'application')
          .where('application.userId = :userId', { userId })
          .getQuery();
        return `job.id NOT IN ${subQuery}`;
      });
    }

    return query.getMany();
  }
}

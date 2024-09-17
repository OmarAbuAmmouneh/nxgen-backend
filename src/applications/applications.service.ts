import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { UpdateApplicationStatusDto } from './dto/update-application.dto';
import { ApplicationStatus, CreateApplicationDto } from './dto/create-application.dto';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

  ) {}

  async findAll(): Promise<Application[]> {
    return await this.applicationsRepository.find();
  }

  async updateStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<Application> {
    const application = await this.applicationsRepository.findOneBy({ id: +id });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    application.status = updateApplicationStatusDto.status;
    return await this.applicationsRepository.save(application);
  }

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    // Validate User
    const user = await this.userRepository.findOneBy({ id: createApplicationDto.userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${createApplicationDto.userId} not found`);
    }

    // Validate Job
    const job = await this.jobRepository.findOneBy({ id: createApplicationDto.jobId });
    if (!job) {
      throw new NotFoundException(`Job with ID ${createApplicationDto.jobId} not found`);
    }

    // Create and save application
    const application = this.applicationRepository.create({
      ...createApplicationDto,
      status: createApplicationDto.status || ApplicationStatus.SUBMITTED,
      user,
      job,
    });
    return this.applicationRepository.save(application);
  }
}

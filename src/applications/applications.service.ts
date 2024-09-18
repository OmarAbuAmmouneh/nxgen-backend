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

  async findAll(userId?: number): Promise<Partial<Application>[]> {
    const queryBuilder = this.applicationsRepository.createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.job', 'job')
      .select([
        'application.id',
        'application.resume',
        'application.status',
        'application.createdAt',
        'user.email',
        'job.title'
      ]);
      console.log(userId, 'userId')
    if (userId) {
      queryBuilder.where('user.id = :userId', { userId });
    }

    const applications = await queryBuilder.getMany();

    return applications.map(app => ({
      id: app.id,
      resume: app.resume,
      status: app.status,
      createdAt: app.createdAt,
      userEmail: app.user.email,
      jobTitle: app.job.title,
    }));
  }


  async updateStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<null> {
    const application = await this.applicationsRepository.findOneBy({ id: +id });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    application.status = updateApplicationStatusDto.status;
    await this.applicationsRepository.save(application);
    return null;
  }

  async create(createApplicationDto: CreateApplicationDto): Promise<null> {
    const user = await this.userRepository.findOneBy({ id: createApplicationDto.userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${createApplicationDto.userId} not found`);
    }

    const job = await this.jobRepository.findOneBy({ id: createApplicationDto.jobId });
    if (!job) {
      throw new NotFoundException(`Job with ID ${createApplicationDto.jobId} not found`);
    }

    const application = this.applicationRepository.create({
      ...createApplicationDto,
      status: createApplicationDto.status || ApplicationStatus.SUBMITTED,
      user,
      job,
    });
    await this.applicationRepository.save(application);
    return null;
  }
}

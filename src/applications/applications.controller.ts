import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { MetricsService } from 'src/metrics/metrics.service';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly metricsService: MetricsService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('userId') userId?: string): Promise<Partial<Application>[]> {
    return this.applicationsService.findAll(
      userId ? Number(userId) : undefined,
    );
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      updateApplicationStatusDto,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    this.metricsService.incrementApplicationCounter(createApplicationDto.jobId.toString());
    return this.applicationsService.create(createApplicationDto);
  }
}

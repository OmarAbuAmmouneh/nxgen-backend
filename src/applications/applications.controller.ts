import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateApplicationStatusDto: UpdateApplicationStatusDto) {
    return this.applicationsService.updateStatus(id, updateApplicationStatusDto);
  }

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto): Promise<Application> {
    return this.applicationsService.create(createApplicationDto);
  }
}

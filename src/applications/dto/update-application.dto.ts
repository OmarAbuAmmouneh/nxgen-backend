import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}

export class UpdateApplicationStatusDto {
    status: 'under review' | 'accepted' | 'rejected';
  }
  

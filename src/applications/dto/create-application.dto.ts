import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum ApplicationStatus {
    SUBMITTED = 'submitted',
    UNDER_REVIEW = 'under review',
    REJECTED = 'rejected',
    ACCEPTED = 'accepted',
  }

export class CreateApplicationDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  jobId: number;

  @IsNotEmpty()
  @IsString()
  resume: string;

  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}


  

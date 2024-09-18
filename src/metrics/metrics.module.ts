import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';  // Create this file next

@Module({
  providers: [MetricsService],
  exports: [MetricsService],
  controllers: [MetricsController],  // Register the controller if you want to expose an endpoint
})
export class MetricsModule {}

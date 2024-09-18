import { Injectable, OnModuleInit } from '@nestjs/common';
import { Counter, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new Registry();
  private readonly applicationCounter: Counter<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry });

    this.applicationCounter = new Counter({
      name: 'job_applications_total',
      help: 'Total number of job applications submitted',
      labelNames: ['job_id'],
    });

    this.registry.registerMetric(this.applicationCounter);
  }

  onModuleInit() {
    // Initialization logic if needed
  }

  incrementApplicationCounter(jobId: string) {
    this.applicationCounter.inc({ job_id: jobId });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

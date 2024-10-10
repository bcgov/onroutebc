import { SchedulerRegistry } from '@nestjs/schedule';

export const isCronRunning = (
  cronJobName: string,
  schedulerRegistry: SchedulerRegistry,
): boolean => {
  const job = schedulerRegistry.getCronJob(cronJobName);
  return job.running;
};

export const runCronJob = (
  cronJobName: string,
  schedulerRegistry: SchedulerRegistry,
) => {
  const job = schedulerRegistry.getCronJob(cronJobName);
  job.fireOnTick();
};

export const stopCronJob = (
  cronJobName: string,
  schedulerRegistry: SchedulerRegistry,
) => {
  const job = schedulerRegistry.getCronJob(cronJobName);
  job.stop();
};

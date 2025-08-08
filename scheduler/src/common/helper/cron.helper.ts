import { SchedulerRegistry } from '@nestjs/schedule';

export const isCronRunning = (
  cronJobName: string,
  schedulerRegistry: SchedulerRegistry,
): boolean => {
  const job = schedulerRegistry.getCronJob(cronJobName);
  return job.isActive;
};

export const runCronJob = async (
  cronJobName: string,
  schedulerRegistry: SchedulerRegistry,
) => {
  const job = schedulerRegistry.getCronJob(cronJobName);
  await job.fireOnTick();
};

export const stopCronJob = async (
  cronJobName: string,
  schedulerRegistry: SchedulerRegistry,
) => {
  const job = schedulerRegistry.getCronJob(cronJobName);
  await job.stop();
};

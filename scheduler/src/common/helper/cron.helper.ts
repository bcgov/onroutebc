import { SchedulerRegistry } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';

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

/**
 * Checks if the current deployment cluster matches the configured scheduler cluster.
 *
 * @param logger - Logger instance for logging cluster mismatch
 * @param jobName - Name of the cron job for logging purposes
 * @returns true if the job should run, false if it should be skipped
 */
export const shouldRunOnCluster = (
  logger: Logger,
  jobName: string,
): boolean => {
  const deployCluster = process.env.DEPLOY_CLUSTER || '';
  const schedulerCluster = process.env.SCHEDULER_CLUSTER || '';

  if (deployCluster !== schedulerCluster) {
    logger.log(
      `Skipping ${jobName}: DEPLOY_CLUSTER=${deployCluster} does not match SCHEDULER_CLUSTER=${schedulerCluster}`,
    );
    return false;
  }

  return true;
};

import { InjectMapper } from '@automapper/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutageNotification } from './entities/outage-notification.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { ReadOutageNotificationDto } from './dto/read-outage-notification.dto';

@Injectable()
export class OutageNotificationService {
  private readonly logger = new Logger(OutageNotificationService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(OutageNotification)
    private outageNotificationRepository: Repository<OutageNotification>,
  ) {}

  @LogAsyncMethodExecution()
  async findOutageNotification(): Promise<ReadOutageNotificationDto> {
    const currentTime = new Date();
    const notifications = await this.findNotifications(currentTime);

    const [readOutageNotificationDto] = await this.classMapper.mapArrayAsync(
      notifications,
      OutageNotification,
      ReadOutageNotificationDto,
    );
    return readOutageNotificationDto;
  }

  /**
   *
   * This method queries the `outageNotificationRepository` for entries where:
   * - `startTimestamp` is less than or equal to the provided `currentTime`
   * - `endTimestamp` is greater than or equal to the provided `currentTime`
   *
   * The results are ordered by `updatedDateTime` in descending order, and only the most
   * recent entry is returned (limited to 1 result).
   *
   * @param currentTime - The point in time to filter active outage notifications.
   * @returns A Promise resolving to an array containing at most one `OutageNotification`
   *          that is active during the specified time.
   */
  @LogAsyncMethodExecution()
  async findNotifications(currentTime: Date): Promise<OutageNotification[]> {
    return await this.outageNotificationRepository.find({
      where: {
        startTimestamp: LessThanOrEqual(currentTime),
        endTimestamp: MoreThanOrEqual(currentTime),
      },
      order: {
        updatedDateTime: 'DESC',
      },
      take: 1,
    });
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { OutageNotification } from './entities/outage-notification.entity';
import { ReadOutageNotificationDto } from './dto/read-outage-notification.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKey } from 'src/common/enum/cache-key.enum';

@Injectable()
export class OutageNotificationService {
  private readonly logger = new Logger(OutageNotificationService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(OutageNotification)
    private outageNotificationRepository: Repository<OutageNotification>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @LogAsyncMethodExecution()
  async getOutageNotification(): Promise<ReadOutageNotificationDto> {
    const cachedValue = await this.cacheManager.get(
      CacheKey.OUTAGE_NOTIFICATION,
    );
    if (cachedValue != null) {
      return cachedValue as ReadOutageNotificationDto;
    }
    const notification = await this.findOutageNotification();
    const notificationToCache =
      notification != null ? notification : new ReadOutageNotificationDto();
    await this.cacheManager.set(
      CacheKey.OUTAGE_NOTIFICATION,
      notificationToCache,
      +process.env.PUBLIC_API_NOTIFICATION_DB_CACHE_TTL_MS || 300000, // Use the cache TTL from the environment variable or default to 300,000 milliseconds (5 minutes) if not set.
    );
    return notificationToCache;
  }
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

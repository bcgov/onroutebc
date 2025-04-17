import { Module } from '@nestjs/common';
import { OutageNotificationController } from './outage-notification.controller';
import { OutageNotificationService } from './outage-notification.service';
import { OutageNotificationProfile } from './profile/outage-notification.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutageNotification } from './entities/outage-notification.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutageNotification]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: +process.env.PUBLIC_API_TTL,
          limit: +process.env.PUBLIC_API_RATE_LIMIT,
        },
      ],
    }),
  ],
  controllers: [OutageNotificationController],
  providers: [
    OutageNotificationService,
    OutageNotificationProfile,
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
      },
  ],
})
export class OutageNotificationModule {}

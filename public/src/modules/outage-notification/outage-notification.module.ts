import { Module } from '@nestjs/common';
import { OutageNotificationController } from './outage-notification.controller';
import { OutageNotificationService } from './outage-notification.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { OutageNotificationProfile } from './profile/outage-notification.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutageNotification } from './entities/outage-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutageNotification]),
    ThrottlerModule.forRoot([
      {
        ttl: 0,
        limit: 0,
      },
    ]),
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

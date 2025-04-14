import { Module } from '@nestjs/common';
import { OutageNotificationController } from './outage-notification.controller';
import { OutageNotificationService } from './outage-notification.service';
import { OutageNotification } from './entities/outage-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutageNotificationProfile } from './profile/outage-notification.profile';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutageNotification]),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 5 }],
    }),
  ],
  controllers: [OutageNotificationController],
  providers: [OutageNotificationService, OutageNotificationProfile],
})
export class OutageNotificationModule {}

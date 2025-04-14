import { Module } from '@nestjs/common';
import { OutageNotificationController } from './outage-notification.controller';
import { OutageNotificationService } from './outage-notification.service';
import { OutageNotification } from './entities/outage-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutageNotificationProfile } from './profile/outage-notification.profile';

@Module({
  imports: [TypeOrmModule.forFeature([OutageNotification])],
  controllers: [OutageNotificationController],
  providers: [OutageNotificationService, OutageNotificationProfile],
})
export class OutageNotificationModule {}

import { Module } from '@nestjs/common';
import { OutageNotificationController } from './outage-notification.controller';
import { OutageNotificationService } from './outage-notification.service';
import { OutageNotificationProfile } from './profile/outage-notification.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutageNotification } from './entities/outage-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OutageNotification])],
  controllers: [OutageNotificationController],
  providers: [OutageNotificationService, OutageNotificationProfile],
})
export class OutageNotificationModule {}

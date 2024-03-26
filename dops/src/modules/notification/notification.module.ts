import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DmsModule } from '../dms/dms.module';

@Module({
  imports: [DmsModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}

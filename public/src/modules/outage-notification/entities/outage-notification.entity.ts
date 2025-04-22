import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'ORBC_OUTAGE_NOTIFICATION' })
export class OutageNotification extends Base {
  /**
   * An auto-generated unique identifier for the outage notification.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'OUTAGE_NOTIFICATION_ID' })
  outageNotificationId: number;

  /**
   * The outage notification title.
   */
  @AutoMap()
  @ApiProperty({ description: 'Title for outage notification' })
  @Column({ length: 255, name: 'TITLE', nullable: false })
  title: string;

  /**
   * The outage notification message.
   */
  @AutoMap()
  @ApiProperty({ description: 'Message for outage notification' })
  @Column({ name: 'MESSAGE', nullable: false })
  message: string;

  @AutoMap()
  @ApiProperty({ description: 'Start timestamp for outage notification' })
  @Column({ name: 'EFFECTIVE_START_TIMESTAMP', nullable: false })
  startTimestamp: Date;

  @AutoMap()
  @ApiProperty({ description: 'End timestamp for outage notification' })
  @Column({ name: 'EFFECTIVE_END_TIMESTAMP', nullable: false })
  endTimestamp: Date;
}
